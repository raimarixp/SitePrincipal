import * as admin from "firebase-admin";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Inicializa o Admin SDK
admin.initializeApp();
export const db = admin.firestore();

// ==========================================
// 2. FUNÇÃO DE CHECKOUT (Cria Pedido + Link MP)
// ==========================================
export const createPayment = onCall(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] },
  async (request) => {
    // 1. Dados Básicos
    const userId = request.auth ? request.auth.uid : 'guest';
    const userEmail = request.auth?.token.email || request.data.payer?.email || 'email@pendente.com';
    
    // NOVO: Recebendo dados pessoais do Frontend
    const payerInfo = request.data.payer || {};
    
    // 2. Validação Carrinho (Igual ao anterior...)
    const cartItems = request.data.items;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new HttpsError('invalid-argument', 'Carrinho vazio.');
    }

    // 3. Loop de Produtos (Igual ao anterior...)
    const validatedItems = [];
    let totalAmount = 0;

    try {
      for (const item of cartItems) {
        const productDoc = await db.collection('products').doc(item.id).get();
        if (!productDoc.exists) throw new HttpsError('not-found', `Produto ${item.id} off.`);
        
        const data = productDoc.data();
        const price = Number(data?.price || 0);
        const qtd = Number(item.quantity);

        validatedItems.push({
          id: item.id,
          title: data?.name || 'Produto',
          quantity: qtd,
          currency_id: 'BRL',
          unit_price: price,
          picture_url: data?.images?.[0] || ''
        });
        totalAmount += price * qtd;
      }

      // 4. CRIAR PEDIDO (Com dados completos)
      const orderRef = await db.collection('orders').add({
        userId,
        userEmail,
        userInfo: payerInfo, // Salva CPF/Nome no pedido do Firestore
        items: validatedItems,
        total: totalAmount,
        status: 'pending',
        deliveryAddress: request.data.deliveryAddress || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 5. MERCADO PAGO CONFIG
      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });
      const preference = new Preference(client);
      const projectId = process.env.GCLOUD_PROJECT;
      
      // 6. CRIAR PREFERÊNCIA (AGORA COM CPF!)
      const result = await preference.create({
        body: {
          items: validatedItems,
          // AQUI ESTÁ A MUDANÇA CRUCIAL:
          payer: {
            email: userEmail,
            name: payerInfo.name,
            surname: '', // Opcional, pode mandar tudo no name
            phone: {
              area_code: payerInfo.phone?.substring(1, 3) || '',
              number: payerInfo.phone?.substring(5) || ''
            },
            identification: {
              type: "CPF",
              number: payerInfo.cpf?.replace(/\D/g, '') // Remove pontos e traços
            }
          },
          external_reference: orderRef.id,
          back_urls: {
            success: "https://seusite.com/sucesso",
            failure: "https://seusite.com/falha",
            pending: "https://seusite.com/pendente",
          },
          auto_return: "approved",
          notification_url: `https://us-central1-${projectId}.cloudfunctions.net/paymentWebhook`
        },
      });

      return { init_point: result.init_point };

    } catch (error: any) {
      logger.error("Erro checkout:", error);
      throw new HttpsError('internal', error.message);
    }
  }
);

// ==========================================
// 3. WEBHOOK (OUVINTE DE PAGAMENTOS)
// ==========================================
export const paymentWebhook = onRequest(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] },
  async (req, res) => {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      logger.error("Token MP ausente.");
      res.status(500).send("Config Error");
      return;
    }

    // O Mercado Pago envia o ID de formas diferentes dependendo da versão
    // As vezes vem em req.body.data.id, as vezes req.query.id, as vezes req.body.id
    const queryId = req.query.id || req.query['data.id']; 
    const bodyId = req.body?.data?.id || req.body?.id;
    const paymentId = bodyId || queryId;
    
    const topic = req.query.topic || req.body?.type;

    // Log para debug (ajuda a ver o que está chegando)
    logger.info("Webhook recebido:", { topic, paymentId, body: req.body, query: req.query });

    // Se for notificação de pagamento
    if ((topic === 'payment' || topic === 'payment.created' || topic === 'payment.updated') && paymentId) {
      
      try {
        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const paymentClient = new Payment(client);
        
        // Consulta a API do MP para garantir status real (Segurança contra Spoofing)
        const payment = await paymentClient.get({ id: String(paymentId) });

        logger.info(`Status do Pagamento ${paymentId}: ${payment.status}`);

        if (payment.status === 'approved') {
          // Recupera o ID do pedido que enviamos no passo 6 do createPayment
          const orderId = payment.external_reference; 

          if (orderId) {
            logger.info(`✅ Pagamento Aprovado! Atualizando pedido ${orderId}`);
            
            await db.collection('orders').doc(orderId).update({
              status: 'paid',
              paidAt: admin.firestore.FieldValue.serverTimestamp(),
              mercadoPagoId: String(payment.id),
              paymentMethod: payment.payment_method_id || 'unknown',
              amountPaid: payment.transaction_amount
            });
          } else {
            logger.warn("⚠️ Pagamento recebido sem external_reference (Order ID).");
          }
        } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
           // Opcional: Atualizar status para falha
           const orderId = payment.external_reference;
           if (orderId) {
             await db.collection('orders').doc(orderId).update({
               status: 'failed',
               updatedAt: admin.firestore.FieldValue.serverTimestamp()
             });
           }
        }
        
        res.status(200).send("OK");
        
      } catch (error) {
        logger.error("Erro ao processar Webhook:", error);
        // Retornar 200 mesmo com erro para evitar retentativas infinitas do MP em caso de erro lógico
        // Se for erro de rede/transiente, pode retornar 500 para ele tentar de novo
        res.status(200).send("Error handled"); 
      }
    } else {
      // Ignora tópicos que não sejam pagamento ou pings de teste
      res.status(200).send("Ignored");
    }
  }
);
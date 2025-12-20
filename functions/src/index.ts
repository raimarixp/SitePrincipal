import * as admin from "firebase-admin";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
// Inicializa o Admin SDK
admin.initializeApp();
export const db = admin.firestore();

// ==========================================
// 1. FUNÇÃO PARA POPULAR O BANCO (SEED)
// ==========================================
export const seedDatabase = onRequest(async (req, res) => {
  try {
    const batch = db.batch();

    productsData.forEach((product) => {
      const productRef = db.collection('products').doc(product.id);
      // Usamos { merge: true } para não apagar campos extras se existirem
      batch.set(productRef, product, { merge: true });
    });

    await batch.commit();

    res.status(200).send(`Sucesso! ${productsData.length} produtos sincronizados.`);
  } catch (error) {
    logger.error("Erro ao popular banco:", error);
    res.status(500).send("Erro interno ao popular banco.");
  }
});

// ==========================================
// 2. FUNÇÃO DE CHECKOUT (Cria Pedido + Link MP)
// ==========================================
export const createPayment = onCall(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] },
  async (request) => {
    // 1. Validar autenticação
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Usuário não logado.');
    }

    const userId = request.auth.uid;
    const userEmail = request.auth.token.email || 'cliente@loja.com';
    
    // 2. Validar Carrinho
    const cartItems = request.data.items;
    if (!cartItems || cartItems.length === 0) {
      throw new HttpsError('invalid-argument', 'Carrinho vazio.');
    }

    // 3. Validar Produtos e Calcular Preço Real (Segurança)
    const validatedItems = [];
    let totalAmount = 0;

    try {
      for (const item of cartItems) {
        const productDoc = await db.collection('products').doc(item.id).get();

        if (!productDoc.exists) {
          throw new HttpsError('not-found', `Produto ${item.id} indisponível.`);
        }

        const productData = productDoc.data();
        const unitPrice = Number(productData?.price || 0);
        const quantity = Number(item.quantity);

        validatedItems.push({
          id: item.id,
          title: productData?.name || 'Produto',
          quantity: quantity,
          currency_id: 'BRL',
          unit_price: unitPrice,
          picture_url: productData?.images?.[0] || ''
        });

        totalAmount += unitPrice * quantity;
      }

      // 4. CRIAR O PEDIDO NO FIRESTORE (Status: Pending)
      // Isso é crucial para o Webhook ter o que atualizar depois
      const orderRef = await db.collection('orders').add({
        userId: userId,
        userEmail: userEmail,
        items: validatedItems,
        total: totalAmount,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 5. Configurar Mercado Pago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
      });
      const preference = new Preference(client);

      // 6. Criar Preferência com external_reference
      const result = await preference.create({
        body: {
          items: validatedItems,
          payer: {
            email: userEmail,
          },
          // AQUI ESTÁ O SEGREDO: Vinculamos o ID do pedido do Firestore ao MP
          external_reference: orderRef.id, 
          back_urls: {
            // Substitua pelo seu ID do projeto real
            success: "https://empresa-site-prod.web.app/sucesso",
            failure: "https://empresa-site-prod.web.app/falha",
            pending: "https://empresa-site-prod.web.app/pendente",
          },
          auto_return: "approved",
        },
      });

      return { init_point: result.init_point };

    } catch (error) {
      logger.error("Erro no checkout:", error);
      throw new HttpsError('internal', 'Falha ao criar pagamento.');
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

    // Extração dos dados da query ou body
    const { type, data } = req.body;
    // O MP pode mandar o ID na query string ou no body data
    const queryId = req.query.id || req.query['data.id']; 
    const topic = req.query.topic || type;
    
    // Prioriza o ID que vier (Query ou Body)
    const paymentId = data?.id || queryId;

    // Se for notificação de pagamento
    if (topic === 'payment' && paymentId) {
      logger.info(`🔔 Webhook: Verificando Pagamento ${paymentId}`);

      try {
        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const paymentClient = new Payment(client);
        
        // Consulta a API do MP para garantir status real
        const payment = await paymentClient.get({ id: String(paymentId) });

        if (payment.status === 'approved') {
          // Recupera o ID do pedido que enviamos no passo 6 do createPayment
          const orderId = payment.external_reference; 

          if (orderId) {
            logger.info(`✅ Pagamento Aprovado! Atualizando pedido ${orderId}`);
            
            await db.collection('orders').doc(orderId).update({
              status: 'paid',
              paidAt: admin.firestore.FieldValue.serverTimestamp(),
              mercadoPagoId: payment.id,
              paymentMethod: payment.payment_method_id,
              cardDetails: payment.card || null // Salva detalhes básicos do cartão se houver
            });
          } else {
            logger.warn("⚠️ Pagamento sem external_reference (Order ID).");
          }
        }
        
        res.status(200).send("OK");
        
      } catch (error) {
        logger.error("Erro ao processar Webhook:", error);
        // Retornar 200 mesmo com erro para evitar retentativas infinitas do MP se for erro de lógica nossa
        res.status(200).send("Error handled"); 
      }
    } else {
      // Ignora tópicos que não sejam pagamento
      res.status(200).send("Ignored");
    }
  }
);
import * as admin from "firebase-admin";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Inicializa o Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ==========================================
// 1. HELPERS (Auxiliares de E-mail)
// ==========================================
const createEmailTemplate = (title: string, message: string, items: any[], total: number) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}x ${item.title || item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">R$ ${(item.unit_price || item.price || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
      <h2 style="color: #2563eb; text-align: center;">${title}</h2>
      <p style="font-size: 16px; line-height: 1.5;">${message}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Produto</th>
            <th style="padding: 10px; text-align: right;">Preço</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 15px; font-weight: bold; text-align: right; border-top: 2px solid #ddd;">TOTAL</td>
            <td style="padding: 15px; font-weight: bold; text-align: right; color: #2563eb; border-top: 2px solid #ddd;">R$ ${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #888;">
        <p>Este é um e-mail automático, por favor não responda.</p>
        <p><strong>WebCraftBr</strong> - Soluções Digitais</p>
      </div>
    </div>
  `;
};

// ==========================================
// 2. FUNÇÃO DE CHECKOUT (Cria Pedido + Link MP)
// ==========================================
export const createPayment = onCall(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] },
  async (request) => {
    // 1. Dados Básicos
    const userId = request.auth ? request.auth.uid : 'guest';
    const userEmail = request.auth?.token.email || request.data.payer?.email || 'email@pendente.com';
    const payerInfo = request.data.payer || {};
    
    // 2. Validação Carrinho
    const cartItems = request.data.items;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new HttpsError('invalid-argument', 'Carrinho vazio.');
    }

    // 3. Loop de Produtos e Validação de Preço
    const validatedItems = [];
    let totalAmount = 0;

    try {
      for (const item of cartItems) {
        const productDoc = await db.collection('products').doc(item.id).get();
        if (!productDoc.exists) throw new HttpsError('not-found', `Produto ${item.id} não encontrado ou inativo.`);
        
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

      // 4. CRIAR PEDIDO NO FIRESTORE
      const orderRef = await db.collection('orders').add({
        userId,
        userEmail,
        userInfo: payerInfo, // Salva nome, CPF, telefone
        payer: payerInfo, // Redundância útil para indexação
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
      
      // 6. CRIAR PREFERÊNCIA DE PAGAMENTO
      const result = await preference.create({
        body: {
          items: validatedItems,
          payer: {
            email: userEmail,
            name: payerInfo.name || 'Cliente',
            surname: '', 
            phone: {
              area_code: payerInfo.phone?.substring(1, 3) || '11',
              number: payerInfo.phone?.substring(5) || '999999999'
            },
            identification: {
              type: "CPF",
              number: payerInfo.cpf?.replace(/\D/g, '') || '00000000000'
            }
          },
          external_reference: orderRef.id,
          back_urls: {
            success: "https://webuildbr.com.br/sucesso", // Ajuste para sua URL real
            failure: "https://webuildbr.com.br/falha",
            pending: "https://webuildbr.com.br/pendente",
          },
          auto_return: "approved",
          // O Webhook aponta para esta função cloud abaixo
          notification_url: `https://us-central1-${projectId}.cloudfunctions.net/paymentWebhook`
        },
      });

      return { init_point: result.init_point };

    } catch (error: any) {
      logger.error("Erro checkout:", error);
      throw new HttpsError('internal', error.message || "Erro interno ao processar pagamento.");
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

    const queryId = req.query.id || req.query['data.id']; 
    const bodyId = req.body?.data?.id || req.body?.id;
    const paymentId = bodyId || queryId;
    const topic = req.query.topic || req.body?.type;

    logger.info("Webhook recebido:", { topic, paymentId });

    if ((topic === 'payment' || topic === 'payment.created' || topic === 'payment.updated') && paymentId) {
      try {
        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const paymentClient = new Payment(client);
        
        // Verifica status real na API
        const payment = await paymentClient.get({ id: String(paymentId) });
        logger.info(`Status Pagamento ${paymentId}: ${payment.status}`);

        if (payment.status === 'approved') {
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
          }
        } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
           const orderId = payment.external_reference;
           if (orderId) {
             await db.collection('orders').doc(orderId).update({
               status: 'cancelled',
               updatedAt: admin.firestore.FieldValue.serverTimestamp()
             });
           }
        }
        res.status(200).send("OK");
      } catch (error) {
        logger.error("Erro Webhook:", error);
        res.status(200).send("Error handled"); 
      }
    } else {
      res.status(200).send("Ignored");
    }
  }
);

// ==========================================
// 4. TRIGGERS DE E-MAIL (NOTIFICAÇÕES)
// ==========================================

// A) Novo Pedido Criado -> Envia E-mail de Confirmação
export const onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const order = snapshot.data();
  const orderId = event.params.orderId;
  const email = order.payer?.email || order.userEmail || order.customerEmail;
  const name = order.payer?.name || order.userInfo?.name || "Cliente";

  if (!email) {
    logger.warn(`Pedido ${orderId} sem e-mail, ignorando envio.`);
    return;
  }

  // Cria documento na coleção 'mail' (Lido pela extensão Trigger Email)
  await db.collection("mail").add({
    to: email,
    message: {
      subject: `Recebemos seu pedido! #${orderId.slice(0, 8).toUpperCase()}`,
      html: createEmailTemplate(
        `Olá, ${name}!`,
        `Recebemos seu pedido com sucesso. Estamos aguardando a confirmação do pagamento pelo banco.`,
        order.items || [],
        order.total
      ),
    },
  });
});

// B) Status do Pedido Mudou -> Envia E-mail de Atualização
export const onOrderStatusChanged = onDocumentUpdated("orders/{orderId}", async (event) => {
  const change = event.data;
  if (!change) return;

  const newData = change.after.data();
  const oldData = change.before.data();

  // Só dispara se o status mudou
  if (newData.status === oldData.status) return;

  const email = newData.payer?.email || newData.userEmail || newData.customerEmail;
  const name = newData.payer?.name || newData.userInfo?.name || "Cliente";

  if (!email) return;

  let subject = "";
  let messageBody = "";

  switch (newData.status) {
    case 'paid':
      subject = "Pagamento Aprovado! 🎉";
      messageBody = "Seu pagamento foi confirmado! Já estamos preparando seu pedido para envio/liberação.";
      break;
    case 'shipped':
      subject = "Pedido Enviado! 🚚";
      messageBody = `Boas notícias! Seu pedido está a caminho. ${newData.trackingCode ? `<br/><strong>Código de Rastreio:</strong> ${newData.trackingCode}` : ''}`;
      break;
    case 'delivered':
      subject = "Pedido Entregue! 📦";
      messageBody = "Seu pedido foi entregue. Esperamos que goste! Se puder, deixe uma avaliação em nosso site.";
      break;
    case 'cancelled':
      subject = "Pedido Cancelado ❌";
      messageBody = "Seu pedido foi cancelado. Se você acha que isso é um erro ou precisa de reembolso, entre em contato conosco.";
      break;
    default:
      return; // Outros status não enviam e-mail
  }

  await db.collection("mail").add({
    to: email,
    message: {
      subject: `${subject} - Pedido #${event.params.orderId.slice(0, 8).toUpperCase()}`,
      html: createEmailTemplate(
        subject,
        messageBody,
        newData.items || [],
        newData.total
      ),
    },
  });
});
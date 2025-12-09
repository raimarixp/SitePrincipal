import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Payment } from 'mercadopago';

// Importa os dados dos produtos (certifique-se que este arquivo existe em src/data/products.ts)
import { productsData } from "./data/products";

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
      const docRef = db.collection("products").doc(product.id);
      batch.set(docRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    res.json({ message: "Banco de dados populado com sucesso!", count: productsData.length });
  } catch (error) {
    logger.error("Erro ao popular banco:", error);
    res.status(500).json({ error: "Falha interna ao popular banco" });
  }
});

// ==========================================
// 2. FUNÇÃO DE CHECKOUT (ATUALIZADA)
// ==========================================
export const createPayment = onCall(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] },
  async (request) => {
    logger.info("🚀 [Backend] Iniciando nova transação...");

    const { product } = request.data;
    
    // ... (mantenha as validações de produto e preço iguais) ...
    const price = parseFloat(String(product.price));
    // ...

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) throw new HttpsError('internal', 'Token ausente');

    try {
      // 1. SALVAR PEDIDO NO FIRESTORE (PENDENTE)
      // Isso gera um ID único que usaremos para rastrear o pagamento
      const orderRef = await db.collection('orders').add({
        productId: product.id,
        productName: product.name,
        amount: price,
        status: 'pending', // Começa pendente
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      logger.info(`📝 Pedido criado no banco. ID: ${orderRef.id}`);

      // 2. CONFIGURAR PREFERÊNCIA COM "EXTERNAL_REFERENCE"
      const client = new MercadoPagoConfig({ accessToken: accessToken });
      const preference = new Preference(client);

      const result = await preference.create({
        body: {
          items: [
            {
              id: product.id,
              title: product.name,
              quantity: 1,
              unit_price: price,
              picture_url: product.images?.[0] || '',
              currency_id: 'BRL'
            },
          ],
          // AQUI ESTÁ O TRUQUE: Ligamos o pagamento ao nosso ID do banco
          external_reference: orderRef.id, 
          
          payment_methods: {
            excluded_payment_types: [],
            excluded_payment_methods: [],
            installments: 12
          },
          back_urls: {
            success: "https://empresa-site-prod.web.app/sucesso", // Vamos criar essa página já já
            failure: "https://empresa-site-prod.web.app/falha",
            pending: "https://empresa-site-prod.web.app/falha",
          },
          auto_return: "approved",
          // Configura o Webhook para onde o MP deve gritar (substitua URL depois do deploy)
          notification_url: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/paymentWebhook`
        }
      });

      return { 
        init_point: result.init_point, 
        sandbox_init_point: result.sandbox_init_point,
        orderId: orderRef.id // Retornamos o ID do pedido para o frontend saber
      };

    } catch (error: any) {
      logger.error("❌ ERRO CRÍTICO MP:", error);
      throw new HttpsError('internal', `Erro: ${error.message}`);
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
      logger.error("Token não configurado");
      res.status(500).send("Server Error");
      return;
    }

    // O MP manda uma query string tipo: ?id=12345&topic=payment
    const { type, data } = req.body;
    const queryId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || type;

    // Só nos interessa se for notificação de pagamento
    if (topic === 'payment') {
      const paymentId = data?.id || queryId;
      logger.info(`🔔 Webhook recebido! Payment ID: ${paymentId}`);

      try {
        // 1. Consultar o Mercado Pago para confirmar o status real (Segurança)
        // Nunca confie apenas no req.body, vá na fonte checar.
        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const paymentClient = new Payment(client);
        
        const payment = await paymentClient.get({ id: String(paymentId) });

        // 2. Se aprovado, atualizar o Firestore
        if (payment.status === 'approved') {
          const orderId = payment.external_reference; // Recuperamos nosso ID

          if (orderId) {
            logger.info(`✅ Pagamento Aprovado! Atualizando pedido ${orderId}`);
            
            await db.collection('orders').doc(orderId).update({
              status: 'paid',
              paidAt: admin.firestore.FieldValue.serverTimestamp(),
              mercadoPagoId: payment.id,
              paymentMethod: payment.payment_method_id
            });
          } else {
            logger.warn("⚠️ Pagamento aprovado sem external_reference");
          }
        }
        
        // Responder 200 OK para o Mercado Pago parar de mandar notificação
        res.status(200).send("OK");
        
      } catch (error) {
        logger.error("Erro no Webhook:", error);
        res.status(500).send("Erro interno");
      }
    } else {
      // Outros tópicos (merchant_order, etc) apenas ignoramos com 200 OK
      res.status(200).send("Ignored");
    }
  }
);
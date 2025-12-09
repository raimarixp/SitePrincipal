"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhook = exports.createPayment = exports.seedDatabase = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const mercadopago_1 = require("mercadopago");
const mercadopago_2 = require("mercadopago");
// Importa os dados dos produtos (certifique-se que este arquivo existe em src/data/products.ts)
const products_1 = require("./data/products");
// Inicializa o Admin SDK
admin.initializeApp();
exports.db = admin.firestore();
// ==========================================
// 1. FUNÇÃO PARA POPULAR O BANCO (SEED)
// ==========================================
exports.seedDatabase = (0, https_2.onRequest)(async (req, res) => {
    try {
        const batch = exports.db.batch();
        products_1.productsData.forEach((product) => {
            const docRef = exports.db.collection("products").doc(product.id);
            batch.set(docRef, Object.assign(Object.assign({}, product), { createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        });
        await batch.commit();
        res.json({ message: "Banco de dados populado com sucesso!", count: products_1.productsData.length });
    }
    catch (error) {
        logger.error("Erro ao popular banco:", error);
        res.status(500).json({ error: "Falha interna ao popular banco" });
    }
});
// ==========================================
// 2. FUNÇÃO DE CHECKOUT (ATUALIZADA)
// ==========================================
exports.createPayment = (0, https_1.onCall)({ secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, async (request) => {
    var _a;
    logger.info("🚀 [Backend] Iniciando nova transação...");
    const { product } = request.data;
    // ... (mantenha as validações de produto e preço iguais) ...
    const price = parseFloat(String(product.price));
    // ...
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken)
        throw new https_1.HttpsError('internal', 'Token ausente');
    try {
        // 1. SALVAR PEDIDO NO FIRESTORE (PENDENTE)
        // Isso gera um ID único que usaremos para rastrear o pagamento
        const orderRef = await exports.db.collection('orders').add({
            productId: product.id,
            productName: product.name,
            amount: price,
            status: 'pending', // Começa pendente
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        logger.info(`📝 Pedido criado no banco. ID: ${orderRef.id}`);
        // 2. CONFIGURAR PREFERÊNCIA COM "EXTERNAL_REFERENCE"
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken });
        const preference = new mercadopago_1.Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: product.id,
                        title: product.name,
                        quantity: 1,
                        unit_price: price,
                        picture_url: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || '',
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
                    success: "https://seu-site.web.app/sucesso", // Vamos criar essa página já já
                    failure: "https://seu-site.web.app/falha",
                    pending: "https://seu-site.web.app/pendente",
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
    }
    catch (error) {
        logger.error("❌ ERRO CRÍTICO MP:", error);
        throw new https_1.HttpsError('internal', `Erro: ${error.message}`);
    }
});
// ==========================================
// 3. WEBHOOK (OUVINTE DE PAGAMENTOS)
// ==========================================
exports.paymentWebhook = (0, https_2.onRequest)({ secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, async (req, res) => {
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
        const paymentId = (data === null || data === void 0 ? void 0 : data.id) || queryId;
        logger.info(`🔔 Webhook recebido! Payment ID: ${paymentId}`);
        try {
            // 1. Consultar o Mercado Pago para confirmar o status real (Segurança)
            // Nunca confie apenas no req.body, vá na fonte checar.
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken });
            const paymentClient = new mercadopago_2.Payment(client);
            const payment = await paymentClient.get({ id: String(paymentId) });
            // 2. Se aprovado, atualizar o Firestore
            if (payment.status === 'approved') {
                const orderId = payment.external_reference; // Recuperamos nosso ID
                if (orderId) {
                    logger.info(`✅ Pagamento Aprovado! Atualizando pedido ${orderId}`);
                    await exports.db.collection('orders').doc(orderId).update({
                        status: 'paid',
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        mercadoPagoId: payment.id,
                        paymentMethod: payment.payment_method_id
                    });
                }
                else {
                    logger.warn("⚠️ Pagamento aprovado sem external_reference");
                }
            }
            // Responder 200 OK para o Mercado Pago parar de mandar notificação
            res.status(200).send("OK");
        }
        catch (error) {
            logger.error("Erro no Webhook:", error);
            res.status(500).send("Erro interno");
        }
    }
    else {
        // Outros tópicos (merchant_order, etc) apenas ignoramos com 200 OK
        res.status(200).send("Ignored");
    }
});
//# sourceMappingURL=index.js.map
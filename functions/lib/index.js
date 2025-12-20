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
const logger = __importStar(require("firebase-functions/logger"));
const mercadopago_1 = require("mercadopago");
const products_1 = require("./data/products"); // Certifique-se que o arquivo existe
// Inicializa o Admin SDK
admin.initializeApp();
exports.db = admin.firestore();
// ==========================================
// 1. FUNÇÃO PARA POPULAR O BANCO (SEED)
// ==========================================
exports.seedDatabase = (0, https_1.onRequest)(async (req, res) => {
    try {
        const batch = exports.db.batch();
        products_1.productsData.forEach((product) => {
            const productRef = exports.db.collection('products').doc(product.id);
            // Usamos { merge: true } para não apagar campos extras se existirem
            batch.set(productRef, product, { merge: true });
        });
        await batch.commit();
        res.status(200).send(`Sucesso! ${products_1.productsData.length} produtos sincronizados.`);
    }
    catch (error) {
        logger.error("Erro ao popular banco:", error);
        res.status(500).send("Erro interno ao popular banco.");
    }
});
// ==========================================
// 2. FUNÇÃO DE CHECKOUT (Cria Pedido + Link MP)
// ==========================================
exports.createPayment = (0, https_1.onCall)({ secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, async (request) => {
    var _a;
    // 1. Validar autenticação
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Usuário não logado.');
    }
    const userId = request.auth.uid;
    const userEmail = request.auth.token.email || 'cliente@loja.com';
    // 2. Validar Carrinho
    const cartItems = request.data.items;
    if (!cartItems || cartItems.length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'Carrinho vazio.');
    }
    // 3. Validar Produtos e Calcular Preço Real (Segurança)
    const validatedItems = [];
    let totalAmount = 0;
    try {
        for (const item of cartItems) {
            const productDoc = await exports.db.collection('products').doc(item.id).get();
            if (!productDoc.exists) {
                throw new https_1.HttpsError('not-found', `Produto ${item.id} indisponível.`);
            }
            const productData = productDoc.data();
            const unitPrice = Number((productData === null || productData === void 0 ? void 0 : productData.price) || 0);
            const quantity = Number(item.quantity);
            validatedItems.push({
                id: item.id,
                title: (productData === null || productData === void 0 ? void 0 : productData.name) || 'Produto',
                quantity: quantity,
                currency_id: 'BRL',
                unit_price: unitPrice,
                picture_url: ((_a = productData === null || productData === void 0 ? void 0 : productData.images) === null || _a === void 0 ? void 0 : _a[0]) || ''
            });
            totalAmount += unitPrice * quantity;
        }
        // 4. CRIAR O PEDIDO NO FIRESTORE (Status: Pending)
        // Isso é crucial para o Webhook ter o que atualizar depois
        const orderRef = await exports.db.collection('orders').add({
            userId: userId,
            userEmail: userEmail,
            items: validatedItems,
            total: totalAmount,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // 5. Configurar Mercado Pago
        const client = new mercadopago_1.MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        });
        const preference = new mercadopago_1.Preference(client);
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
    }
    catch (error) {
        logger.error("Erro no checkout:", error);
        throw new https_1.HttpsError('internal', 'Falha ao criar pagamento.');
    }
});
// ==========================================
// 3. WEBHOOK (OUVINTE DE PAGAMENTOS)
// ==========================================
exports.paymentWebhook = (0, https_1.onRequest)({ secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, async (req, res) => {
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
    const paymentId = (data === null || data === void 0 ? void 0 : data.id) || queryId;
    // Se for notificação de pagamento
    if (topic === 'payment' && paymentId) {
        logger.info(`🔔 Webhook: Verificando Pagamento ${paymentId}`);
        try {
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken });
            const paymentClient = new mercadopago_1.Payment(client);
            // Consulta a API do MP para garantir status real
            const payment = await paymentClient.get({ id: String(paymentId) });
            if (payment.status === 'approved') {
                // Recupera o ID do pedido que enviamos no passo 6 do createPayment
                const orderId = payment.external_reference;
                if (orderId) {
                    logger.info(`✅ Pagamento Aprovado! Atualizando pedido ${orderId}`);
                    await exports.db.collection('orders').doc(orderId).update({
                        status: 'paid',
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        mercadoPagoId: payment.id,
                        paymentMethod: payment.payment_method_id,
                        cardDetails: payment.card || null // Salva detalhes básicos do cartão se houver
                    });
                }
                else {
                    logger.warn("⚠️ Pagamento sem external_reference (Order ID).");
                }
            }
            res.status(200).send("OK");
        }
        catch (error) {
            logger.error("Erro ao processar Webhook:", error);
            // Retornar 200 mesmo com erro para evitar retentativas infinitas do MP se for erro de lógica nossa
            res.status(200).send("Error handled");
        }
    }
    else {
        // Ignora tópicos que não sejam pagamento
        res.status(200).send("Ignored");
    }
});
//# sourceMappingURL=index.js.map
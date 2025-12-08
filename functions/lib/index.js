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
exports.createPayment = exports.seedDatabase = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const mercadopago_1 = require("mercadopago");
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
// 2. FUNÇÃO DE CHECKOUT (MERCADO PAGO)
// ==========================================
exports.createPayment = (0, https_1.onCall)({ secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, // Libera acesso à chave segura
async (request) => {
    var _a;
    logger.info("🚀 [Backend] Iniciando processamento de pagamento...");
    // 1. Validação dos Dados Recebidos
    const { product } = request.data;
    if (!product) {
        logger.error("❌ Produto não fornecido no corpo da requisição");
        throw new https_1.HttpsError('invalid-argument', 'Os dados do produto são obrigatórios.');
    }
    // 2. Validação e Tratamento do Preço
    // O MP exige que o preço seja um Number puro. Convertemos para garantir.
    const price = parseFloat(String(product.price));
    if (isNaN(price) || price <= 0) {
        logger.error(`❌ Preço inválido detectado: ${product.price}`);
        throw new https_1.HttpsError('invalid-argument', 'O preço do produto é inválido.');
    }
    // 3. Configuração do Cliente Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
        logger.error("❌ Token do Mercado Pago não encontrado nas variáveis de ambiente");
        throw new https_1.HttpsError('internal', 'Erro de configuração no servidor (Token ausente).');
    }
    try {
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken });
        const preference = new mercadopago_1.Preference(client);
        // 4. Criação da Preferência
        logger.info(`📞 Contatando Mercado Pago para produto: ${product.name} (R$ ${price})`);
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
                // URLs de retorno (Para onde o usuário volta após pagar)
                back_urls: {
                    success: "https://google.com", // TODO: Trocar pela URL real do seu site depois
                    failure: "https://google.com",
                    pending: "https://google.com",
                },
                auto_return: "approved",
            }
        });
        // 5. Validação da Resposta
        if (!result.init_point && !result.sandbox_init_point) {
            logger.error("⚠️ Mercado Pago respondeu, mas sem links de pagamento:", result);
            throw new https_1.HttpsError('unavailable', 'O Mercado Pago não retornou o link de pagamento.');
        }
        logger.info(`✅ Preferência criada com sucesso! ID: ${result.id}`);
        // 6. Retorno para o Frontend
        return {
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
            id: result.id
        };
    }
    catch (error) {
        // Log detalhado do erro técnico
        logger.error("❌ ERRO CRÍTICO NA API DO MP:", error);
        // Retorna um erro amigável para o frontend, mas com detalhes técnicos se necessário
        throw new https_1.HttpsError('internal', `Falha ao processar pagamento: ${error.message || 'Erro desconhecido'}`);
    }
});
//# sourceMappingURL=index.js.map
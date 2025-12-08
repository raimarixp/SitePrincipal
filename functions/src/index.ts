import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { MercadoPagoConfig, Preference } from 'mercadopago';

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
// 2. FUNÇÃO DE CHECKOUT (MERCADO PAGO)
// ==========================================
export const createPayment = onCall(
  { secrets: ["MERCADOPAGO_ACCESS_TOKEN"] }, // Libera acesso à chave segura
  async (request) => {
    logger.info("🚀 [Backend] Iniciando processamento de pagamento...");

    // 1. Validação dos Dados Recebidos
    const { product } = request.data;
    
    if (!product) {
      logger.error("❌ Produto não fornecido no corpo da requisição");
      throw new HttpsError('invalid-argument', 'Os dados do produto são obrigatórios.');
    }

    // 2. Validação e Tratamento do Preço
    // O MP exige que o preço seja um Number puro. Convertemos para garantir.
    const price = parseFloat(String(product.price));
    
    if (isNaN(price) || price <= 0) {
      logger.error(`❌ Preço inválido detectado: ${product.price}`);
      throw new HttpsError('invalid-argument', 'O preço do produto é inválido.');
    }

    // 3. Configuração do Cliente Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      logger.error("❌ Token do Mercado Pago não encontrado nas variáveis de ambiente");
      throw new HttpsError('internal', 'Erro de configuração no servidor (Token ausente).');
    }

    try {
      const client = new MercadoPagoConfig({ accessToken: accessToken });
      const preference = new Preference(client);

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
              picture_url: product.images?.[0] || '',
              currency_id: 'BRL'
            },
          ],

          // 👇 ADICIONE ESTE BLOCO DE MÉTODOS DE PAGAMENTO
          payment_methods: {
            excluded_payment_types: [], // Não excluir nada (garante cartão, boleto, etc)
            excluded_payment_methods: [], // Não excluir nada (garante PIX)
            installments: 12 // Permite até 12x
          },
          // 👆 FIM DO BLOCO
          
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
        throw new HttpsError('unavailable', 'O Mercado Pago não retornou o link de pagamento.');
      }

      logger.info(`✅ Preferência criada com sucesso! ID: ${result.id}`);

      // 6. Retorno para o Frontend
      return { 
        init_point: result.init_point, 
        sandbox_init_point: result.sandbox_init_point,
        id: result.id
      };

    } catch (error: any) {
      // Log detalhado do erro técnico
      logger.error("❌ ERRO CRÍTICO NA API DO MP:", error);
      
      // Retorna um erro amigável para o frontend, mas com detalhes técnicos se necessário
      throw new HttpsError('internal', `Falha ao processar pagamento: ${error.message || 'Erro desconhecido'}`);
    }
  }
);
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../services/firebase';
import { Button } from '../../ui/Button';
import type { Product } from '../../../types';

interface PaymentButtonProps {
  product: Product;
}

export const PaymentButton = ({ product }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    console.log("🚀 Iniciando checkout para:", product.name);

    try {
      // Forçamos o TypeScript a entender que product é um objeto simples
      const payload = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images
      };

      const createPaymentFn = httpsCallable(functions, 'createPayment');
      
      console.log("📞 Chamando Backend...");
      const response = await createPaymentFn({ product: payload });
      
      console.log("✅ Resposta do Backend:", response.data);
      const data = response.data as any;

      // Verifica qual link veio (Sandbox ou Produção)
      const link = data.sandbox_init_point || data.init_point;

      if (link) {
        console.log("🔗 Redirecionando para:", link);
        window.location.href = link;
      } else {
        throw new Error("Link de pagamento não recebido do Mercado Pago");
      }

    } catch (error: any) {
      console.error("❌ ERRO DETALHADO:", error);
      
      // Mostra o erro na tela para facilitar
      alert(`Erro no pagamento: ${error.message || JSON.stringify(error)}`);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleBuy} 
      isLoading={loading}
      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-green-900/20"
    >
      Comprar Agora
    </Button>
  );
};
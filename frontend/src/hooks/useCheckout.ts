import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface CheckoutItem {
  id: string;
  quantity: number;
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (items: CheckoutItem[]) => {
    setIsLoading(true);

    try {
      // 1. Referência para a função no Backend
      const createPaymentFunction = httpsCallable(functions, 'createPayment');

      // 2. Chama a função enviando os itens
      // IMPORTANTE: A estrutura { items: [...] } deve bater com o que o backend espera
      const response = await createPaymentFunction({ items });
      
      const data = response.data as { init_point: string };

      // 3. Redireciona para o Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro: Link de pagamento não gerado.");
      }

    } catch (error: any) {
      console.error("❌ ERRO NO CHECKOUT:", error);
      
      // Tratamento de erros comuns
      if (error.message.includes('Carrinho vazio')) {
        alert("Erro: Nenhum item selecionado para compra.");
      } else if (error.message.includes('unauthenticated')) {
        alert("Você precisa fazer login para comprar.");
        // Opcional: Redirecionar para /login
        window.location.href = '/login';
      } else {
        alert("Ocorreu um erro ao processar o pagamento. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCheckout, isLoading };
};
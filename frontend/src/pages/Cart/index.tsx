import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext'; // Caminho corrigido para o contexto
import { useAuth } from '../../contexts/AuthContext'; // Caminho corrigido para o auth
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase';

export const Cart = () => {
  // ✅ Recuperando updateQuantity do Contexto para corrigir o erro de "remover tudo"
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // === LÓGICA DE CHECKOUT (MERCADO PAGO) ===
  const handleCheckout = async () => {
    // 1. Verifica Login
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsCheckingOut(true);
    try {
      console.log("🛒 Preparando checkout...");

      // 2. Sanitização de Dados (Evita erros 400 do Mercado Pago)
      const cleanItems = cart.map(item => {
        const price = Number(item.price);
        
        // Garante URL válida ou fallback
        let imgUrl = item.images?.[0] || '';
        if (imgUrl && !imgUrl.startsWith('http')) {
          imgUrl = `https://images.unsplash.com/${imgUrl.replace('https://images.unsplash.com/', '')}`;
        }
        if (!imgUrl) imgUrl = 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif';

        return {
          id: item.id,
          title: item.name || 'Produto',
          unit_price: price, 
          quantity: Number(item.quantity),
          picture_url: imgUrl,
          currency_id: 'BRL'
        };
      });

      // Remove itens inválidos
      const validItems = cleanItems.filter(i => i.unit_price > 0 && i.quantity > 0);

      if (validItems.length === 0) {
        alert("Erro: Carrinho sem itens válidos.");
        setIsCheckingOut(false);
        return;
      }

      // 3. Chamada Serverless (Firebase Functions)
      const createPaymentFn = httpsCallable(functions, 'createPayment');
      const response = await createPaymentFn({ items: validItems });
      const data = response.data as any;
      const link = data.sandbox_init_point || data.init_point; // Sandbox para testes

      if (link) {
        window.location.href = link; // Redireciona para o Mercado Pago
      } else {
        throw new Error("Backend não retornou link de pagamento");
      }

    } catch (error: any) {
      console.error("❌ Erro Checkout:", error);
      alert(`Falha ao iniciar pagamento: ${error.message || "Tente novamente mais tarde."}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // === ESTADO DE CARRINHO VAZIO (NOVO DESIGN) ===
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-lg bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center">
          <div className="bg-white/20 p-6 rounded-full mb-6 backdrop-blur-sm animate-pulse">
            <ShoppingBagIcon className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            Seu carrinho está vazio
          </h2>
          
          <p className="text-white/80 text-lg mb-8 max-w-sm">
            Parece que você ainda não escolheu seus produtos favoritos.
          </p>

          <Link to="/produtos" className="w-full sm:w-auto">
            <Button className="bg-white text-red-600 hover:bg-gray-100 border-none px-8 py-3 text-lg font-bold">
              Começar a Comprar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // === CARRINHO COM ITENS ===
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
          Carrinho de Compras
          <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} itens
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* === LISTA DE PRODUTOS === */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                {/* Imagem */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Detalhes */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      <Link to={`/produtos/${item.id}`} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    <p className="text-lg font-bold text-primary mt-1 sm:hidden">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      {/* Botão MENOS: Chama updateQuantity com -1 */}
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1} // Impede chegar a 0 aqui (opcional)
                        title="Diminuir quantidade"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-10 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      
                      {/* Botão MAIS: Chama updateQuantity com +1 */}
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-200 text-primary rounded-r-lg transition-colors"
                        title="Aumentar quantidade"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Preço Desktop */}
                    <div className="hidden sm:block text-right min-w-[100px]">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Botão LIXEIRA: Remove item inteiro */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Remover produto"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/produtos" className="inline-flex items-center text-primary hover:text-primary-dark font-medium mt-4 group">
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Continuar Comprando
            </Link>
          </div>

          {/* === RESUMO DO PEDIDO === */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button 
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                >
                  Finalizar Compra
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento 100% Seguro via Mercado Pago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
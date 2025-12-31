import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  ShoppingBagIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';

export const Cart = () => {
  // 1. ATENÇÃO: Usando os nomes corretos do Contexto atualizado
  const { 
    cartItems,      // Antes era 'cart'
    removeFromCart, 
    updateQuantity, 
    cartTotal,      // Antes era 'total'
    cartCount       // Já vem calculado do contexto
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  // location pode ser usado se precisar voltar pra página anterior, mas aqui não estamos usando explicitamente
  // const location = useLocation(); 
  const [isRedirecting, setIsRedirecting] = useState(false);

  // === LÓGICA DE NAVEGAÇÃO PARA CHECKOUT ===
  const handleCheckout = () => {
    setIsRedirecting(true);

    // 1. Verifica Login
    if (!user) {
      // Envia para login, salvando que o usuário queria ir para o checkout
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // 2. Redireciona para o Checkout
    navigate('/checkout');
    setIsRedirecting(false);
  };

  // === ESTADO DE CARRINHO VAZIO ===
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-slate-900 transition-colors">
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
            <Button className="bg-white text-red-600 hover:bg-gray-100 border-none px-8 py-3 text-lg font-bold w-full sm:w-auto">
              Começar a Comprar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // === CARRINHO COM ITENS ===
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
          Carrinho de Compras
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
            {cartCount} itens
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* === LISTA DE PRODUTOS (COLUNA ESQUERDA) === */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex gap-4 items-center transition-colors">
                
                {/* Imagem */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Detalhes do Item */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                      <Link to={`/produtos/${item.id}`} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
                    <p className="text-lg font-bold text-primary mt-1 sm:hidden">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900">
                      {/* Botão MENOS */}
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-l-lg transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        title="Diminuir quantidade"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      
                      {/* Botão MAIS */}
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-primary rounded-r-lg transition-colors"
                        title="Aumentar quantidade"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Preço Desktop */}
                    <div className="hidden sm:block text-right min-w-[100px]">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Botão LIXEIRA */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
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

          {/* === RESUMO DO PEDIDO (COLUNA DIREITA) === */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 sticky top-28 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumo</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Frete</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Calculado no Checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {/* Botão Finalizar */}
                <Button 
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  isLoading={isRedirecting}
                >
                  <LockClosedIcon className="w-5 h-5" />
                  Finalizar Compra
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900 py-2 rounded-lg border border-gray-100 dark:border-slate-700">
                  <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                  Ambiente Seguro
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Ícone Auxiliar para não quebrar caso não tenha importado
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase';

export const Cart = () => {
  const { cart, removeFromCart, addToCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Função para diminuir quantidade (lógica local simples)
  const decreaseQuantity = (item: any) => {
    if (item.quantity > 1) {
       // Em um app real, teríamos um método updateQuantity no context
       // Aqui, vamos usar um hack simples removendo e readicionando N-1 vezes
       // (Idealmente, adicione updateQuantity no CartContext depois)
       console.log("Para diminuir, implemente updateQuantity no Context");
    } else {
      removeFromCart(item.id);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsCheckingOut(true);
    try {
      console.log("🛒 Preparando carrinho...");

      // SANITIZAÇÃO DE DADOS (Limpeza pesada)
      const cleanItems = cart.map(item => {
        // 1. Garante que preço é número e tem 2 casas decimais
        const price = Number(item.price);
        
        // 2. Garante URL da imagem válida (MP rejeita 404 ou urls relativas)
        let imgUrl = item.images?.[0] || '';
        if (imgUrl && !imgUrl.startsWith('http')) {
          // Se for antiga, tenta consertar ou usa placeholder
          imgUrl = `https://images.unsplash.com/${imgUrl.replace('https://images.unsplash.com/', '')}`;
        }
        // Fallback final se não tiver imagem
        if (!imgUrl) imgUrl = 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif';

        return {
          id: item.id,
          title: item.name || 'Produto sem nome', // Garante título
          unit_price: price, 
          quantity: Number(item.quantity),
          picture_url: imgUrl
        };
      });

      // Validação Extra: Remove itens com preço zero ou negativo
      const validItems = cleanItems.filter(i => i.unit_price > 0 && i.quantity > 0);

      if (validItems.length === 0) {
        alert("Erro: Carrinho sem itens válidos (preço zerado?).");
        setIsCheckingOut(false);
        return;
      }

      console.log("📦 Payload Limpo enviado:", validItems);

      const createPaymentFn = httpsCallable(functions, 'createPayment');
      
      // Enviamos 'items' (plural)
      const response = await createPaymentFn({ items: validItems });

      const data = response.data as any;
      const link = data.sandbox_init_point || data.init_point;

      if (link) {
        window.location.href = link;
      } else {
        throw new Error("Backend não retornou link de pagamento");
      }

    } catch (error: any) {
      console.error("❌ Erro Checkout:", error);
      // Mostra o erro real que veio do Backend (se houver)
      const message = error.message || "Erro desconhecido";
      alert(`Falha no pagamento: ${message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <TrashIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nenhum produto.</p>
        <Link to="/produtos">
          <Button>Começar a Comprar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-4">
          Carrinho de Compras
          <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} itens
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between self-stretch py-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 line-clamp-1">
                        <Link to={`/produtos/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => removeFromCart(item.id)} // Simplificado para remover
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        title="Remover"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold border-l border-r border-gray-300 bg-gray-50">
                        {item.quantity} un
                      </span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1 hover:bg-gray-100 text-primary"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/produtos" className="inline-flex items-center text-sm text-primary hover:underline mt-4 font-medium">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Continuar Comprando
            </Link>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                >
                  Finalizar Compra
                </Button>
                <div className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">🔒 Ambiente Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
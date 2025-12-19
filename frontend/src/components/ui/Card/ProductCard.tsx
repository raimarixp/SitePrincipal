import { Link } from 'react-router-dom';
import { ShoppingBagIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // Adicionei CreditCardIcon
import { useCart } from '../../../contexts/CartContext';
import { formatPrice } from '../../../utils/helpers';
import { useCheckout } from '../../../hooks/useCheckout'; // 👇 Importe o Hook novo

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { handleCheckout, isLoading } = useCheckout(); // 👇 Use o Hook

  // Função para "Adicionar ao Carrinho" (mantém na página)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    // Opcional: Mostrar um toast/aviso de sucesso
  };

  // Função para "Comprar Agora" (vai pro checkout direto)
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Envia APENAS este produto para o checkout
    await handleCheckout([{ id: product.id, quantity: 1 }]);
  };

  return (
    <Link to={`/produtos/${product.id}`} className="group relative block h-full">
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
        
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          {product.featured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                Destaque
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-6">
          <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
            {product.category}
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">À vista</span>
              <p className="text-2xl font-black text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Botão Carrinho */}
              <button
                onClick={handleAddToCart}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-all hover:bg-gray-200 hover:text-primary active:scale-95"
                title="Adicionar ao Carrinho"
              >
                <ShoppingBagIcon className="h-6 w-6" />
              </button>

              {/* Botão Comprar Agora (Vermelho) */}
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-hover hover:scale-110 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                title="Comprar Agora"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CreditCardIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import { Button } from '../Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden">
      
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Badge de Oferta (Exemplo) */}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
            Destaque
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link to={`/produtos/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price * 1.2)}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* O botão fica acima do link "absolute inset-0" usando z-index relative */}
          <Button 
            size="sm" 
            className="relative z-10 rounded-full px-3"
            onClick={(e) => {
              e.preventDefault(); // Evita navegar para a página do produto ao clicar no botão
              console.log('Adicionar ao carrinho:', product.id);
            }}
          >
            <ShoppingBagIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon // Ícone novo para "Ver Detalhes"
} from '@heroicons/react/24/outline';

import { useCart } from '../../../contexts/CartContext';
import { formatPrice, createWhatsAppLink } from '../../../utils/helpers';

// Interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
  requiresQuote?: boolean;
  isConsultation?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  // Verifica se é orçamento
  const isQuote = Boolean(product.requiresQuote) || Boolean(product.isConsultation);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isQuote) return;
    addToCart(product);
  };

  return (
    // 1. Elemento pai (Card Wrapper)
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      
      {/* 2. Área da Imagem (Linkável) */}
      <Link to={`/produtos/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
        <img 
          src={(product.images && product.images[0]) ? product.images[0] : '/placeholder.jpg'} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          loading="lazy"
        />
        
        {/* Badge de Destaque */}
        {product.featured && !isQuote && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
              Destaque
            </span>
          </div>
        )}

        {/* Badge de Orçamento */}
        {isQuote && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
              Orçamento
            </span>
          </div>
        )}
      </Link>

      {/* Info do Produto */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
          {product.category}
        </p>
        
        {/* Título (Linkável) */}
        <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2 mb-4">
          <Link to={`/produtos/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3">
          
          {/* Preço */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">
              {isQuote ? 'Disponibilidade' : 'À vista'}
            </span>
            
            {isQuote ? (
              <p className="text-lg font-bold text-blue-600">
                Sob Consulta
              </p>
            ) : (
              <p className="text-2xl font-black text-primary">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 relative z-20">
            
            {isQuote ? (
              /* Botão WhatsApp */
              <a
                href={createWhatsAppLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 h-12 rounded-full bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                title="Falar com Consultor"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                <span className="hidden sm:inline text-sm">Cotar</span>
              </a>
            ) : (
              /* Botões Padrão (Ver Detalhes + Adicionar ao Carrinho) */
              <>
                {/* Botão Secundário: Ver Detalhes (Substitui o Comprar Agora) */}
                <Link
                  to={`/produtos/${product.id}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-all hover:bg-gray-200 hover:text-primary active:scale-95"
                  title="Ver Detalhes"
                >
                  <EyeIcon className="h-6 w-6" />
                </Link>

                {/* Botão Primário: Adicionar ao Carrinho (Agora com destaque Azul) */}
                <button
                  onClick={handleAddToCart}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors active:scale-95"
                  title="Adicionar ao Carrinho"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
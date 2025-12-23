import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { formatPrice, createWhatsAppLink } from '../../utils/helpers';
import { useCart } from '../../contexts/CartContext';
import { useCheckout } from '../../hooks/useCheckout';

import { 
  ChevronLeftIcon, 
  CheckBadgeIcon, 
  ChatBubbleLeftRightIcon, 
  ShoppingCartIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  CheckIcon,     // Novo ícone para a lista de features
  GlobeAltIcon   // Novo ícone para o link de demo
} from '@heroicons/react/24/outline';

// ✅ INTERFACE ATUALIZADA (Suporta Serviços e Portfólio)
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  
  // Controle de Orçamento
  requiresQuote?: boolean; 
  isConsultation?: boolean;

  // ✨ NOVOS CAMPOS
  features?: string[]; // Lista de itens inclusos (ex: ["SEO", "Design Responsivo"])
  demoUrl?: string;    // Link para ver o site modelo ao vivo
}

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hooks
  const { addToCart } = useCart();
  const { handleCheckout, isLoading: isCheckoutLoading } = useCheckout();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.log("Produto não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Lógica para determinar se é Orçamento (Serviço) ou Venda (Produto)
  const isQuote = product ? (Boolean(product.requiresQuote) || Boolean(product.isConsultation)) : false;

  const handleBuyNow = async () => {
    if (product) {
      await handleCheckout([{ id: product.id, quantity: 1 }]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Sugestão: Substituir por um Toast Notification no futuro
      alert('Produto adicionado ao carrinho!'); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 text-center px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">O produto que você procura não está disponível.</p>
        <Link to="/produtos">
          <Button variant="outline">Voltar para Loja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb / Voltar */}
        <Link 
          to="/produtos" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 transition-colors font-medium"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Voltar para produtos
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="lg:grid lg:grid-cols-2">
            
            {/* === COLUNA ESQUERDA: Imagem === */}
            <div className="relative aspect-square bg-gray-100 lg:border-r border-gray-100">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              
              {/* Badge Dinâmico: Orçamento vs Destaque */}
              {isQuote ? (
                <div className="absolute top-6 left-6 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  Serviço Sob Medida
                </div>
              ) : (
                <div className="absolute top-6 left-6 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  Entrega Imediata
                </div>
              )}
            </div>

            {/* === COLUNA DIREITA: Informações === */}
            <div className="flex flex-col p-8 lg:p-12">
              <div>
                <span className="text-sm text-primary font-bold tracking-widest uppercase mb-2 block">
                  {product.category}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Preço Condicional */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  {isQuote ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Modelo de contratação</span>
                      <span className="text-2xl font-bold text-blue-600">
                        Orçamento Personalizado
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-green-600 font-medium mb-2 bg-green-50 px-2 py-1 rounded">
                        À vista
                      </span>
                    </div>
                  )}
                </div>

                {/* Descrição Longa */}
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  {product.description || "Descrição detalhada do produto indisponível no momento."}
                </p>

                {/* ✨ NOVA SEÇÃO: Lista de Recursos (Features) ✨ */}
                {product.features && product.features.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckBadgeIcon className="h-5 w-5 text-primary"/>
                      O que está incluso:
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckIcon className="w-3.5 h-3.5 text-green-600 font-bold" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✨ NOVA SEÇÃO: Link de Demo (Portfólio) ✨ */}
                {product.demoUrl && (
                  <div className="mb-8">
                    <a 
                      href={product.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-bold hover:underline bg-primary/5 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10"
                    >
                      <GlobeAltIcon className="h-5 w-5" />
                      Visualizar modelo ao vivo
                    </a>
                  </div>
                )}

                {/* Benefícios Padrão (Fixos) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    Garantia de Qualidade
                  </div>
                  {!isQuote && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <TruckIcon className="h-5 w-5 text-green-500" />
                      Envio Imediato Digital
                    </div>
                  )}
                </div>
              </div>

              {/* === ÁREA DE AÇÃO (Botões) === */}
              <div className="mt-auto">
                
                {isQuote ? (
                  // ✅ MODO SERVIÇO/ORÇAMENTO: Botão WhatsApp
                  <div className="space-y-4">
                    <a 
                      href={createWhatsAppLink(product.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                      >
                        <ChatBubbleLeftRightIcon className="h-6 w-6" />
                        Solicitar Orçamento
                      </Button>
                    </a>
                    <p className="text-center text-sm text-gray-500">
                      Nossa equipe retornará seu contato para entender o projeto.
                    </p>
                  </div>
                ) : (
                  // ✅ MODO PRODUTO/VENDA: Botões Comprar/Carrinho
                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      onClick={handleBuyNow}
                      isLoading={isCheckoutLoading}
                    >
                      <CreditCardIcon className="h-6 w-6" />
                      Comprar Agora
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-white font-bold rounded-xl flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                      disabled={isCheckoutLoading}
                    >
                      <ShoppingCartIcon className="h-6 w-6" />
                      Adicionar ao Carrinho
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <ShieldCheckIcon className="h-4 w-4" />
                      Processado com segurança pelo Mercado Pago
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
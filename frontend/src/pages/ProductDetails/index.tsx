import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { formatPrice, createWhatsAppLink } from '../../utils/helpers';
import { useCart } from '../../contexts/CartContext';
// Removido useCheckout daqui pois o processamento ocorre na página /checkout
// import { useCheckout } from '../../hooks/useCheckout'; 

import { 
  ChevronLeftIcon, 
  CheckBadgeIcon, 
  ChatBubbleLeftRightIcon, 
  ShoppingCartIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  CheckIcon,     // Ícone para itens da lista
  GlobeAltIcon   // Ícone para link de demo
} from '@heroicons/react/24/outline';

// ✅ INTERFACE ATUALIZADA
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  
  // Controle de Orçamento (Serviços)
  requiresQuote?: boolean; 
  isConsultation?: boolean;

  // ✨ NOVOS CAMPOS PARA PORTFÓLIO
  features?: string[]; // Lista de itens inclusos (ex: ["SEO", "Design Responsivo"])
  demoUrl?: string;    // Link para ver o site modelo ao vivo
}

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Hook de navegação

  // === BUSCA DO PRODUTO ===
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

  // === LÓGICA DE EXIBIÇÃO ===
  // Se for categoria "Modelos", tratamos como portfólio (orçamento)
  const isQuote = product ? (Boolean(product.requiresQuote) || Boolean(product.isConsultation) || product.category === 'Modelos') : false;

  // ✅ CORREÇÃO: "Comprar Agora" leva para o Checkout (Dados)
  const handleBuyNow = () => {
    if (product) {
      addToCart(product); // 1. Coloca no carrinho
      navigate('/checkout'); // 2. Leva para preencher os dados
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert('Produto adicionado ao carrinho!'); 
    }
  };

  // === RENDERIZAÇÃO: LOADING ===
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // === RENDERIZAÇÃO: NÃO ENCONTRADO ===
  if (!product) {
    return (
      <div className="min-h-screen pt-32 text-center px-4 bg-gray-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">O produto que você procura não está disponível.</p>
        <Link to="/produtos">
          <Button variant="outline">Voltar para Loja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb / Voltar */}
        <Link 
          to="/produtos" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 mb-8 transition-colors font-medium dark:text-gray-400"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Voltar para produtos
        </Link>

        {/* CONTAINER PRINCIPAL */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col lg:flex-row">
            
          {/* === COLUNA ESQUERDA: Imagem === */}
          <div className="relative h-96 lg:h-auto lg:w-1/2 bg-gray-100 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-700">
            <img 
              // Verificação segura para evitar warning de src=""
              src={(product.images && product.images[0]) ? product.images[0] : '/placeholder.jpg'} 
              alt={product.name} 
              // 'object-top' garante que o Header do site apareça
              className="w-full h-full object-cover object-top"
            />
            
            {/* Badge Dinâmico */}
            <div className={`absolute top-6 left-6 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg ${isQuote ? 'bg-blue-600' : 'bg-gradient-to-r from-red-600 to-pink-600'}`}>
              {isQuote ? 'Serviço Sob Medida' : 'Entrega Imediata'}
            </div>
          </div>

          {/* === COLUNA DIREITA: Informações === */}
          <div className="flex flex-col p-8 lg:p-12 lg:w-1/2">
            <div>
              <span className="text-sm text-red-600 font-bold tracking-widest uppercase mb-2 block">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Preço Condicional */}
              <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                {isQuote ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Modelo de contratação</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-400">A partir de</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">*Valor final depende da personalização</span>
                  </div>
                ) : (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-green-600 font-medium mb-2 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                      À vista
                    </span>
                  </div>
                )}
              </div>

              {/* Descrição Longa */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                {product.description || "Descrição detalhada do produto indisponível no momento."}
              </p>

              {/* ✨ SEÇÃO: Lista de Recursos (Features) ✨ */}
              {product.features && product.features.length > 0 && (
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 mb-8">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckBadgeIcon className="h-5 w-5 text-red-600"/>
                    O que está incluso:
                  </h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                          <CheckIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400 font-bold" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✨ SEÇÃO: Link de Demo (Visualizador Mobile/Desktop) ✨ */}
              {product.demoUrl && (
                <div className="mb-8">
                  <Link 
                    to={`/visualizar/${product.id}`}
                    className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/40 w-full justify-center md:w-auto md:justify-start"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                    Visualizar e testar modelo (Mobile/Desktop)
                  </Link>
                </div>
              )}
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
                      className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 text-white"
                    >
                      <ChatBubbleLeftRightIcon className="h-6 w-6" />
                      Solicitar Orçamento
                    </Button>
                  </a>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Nossa equipe retornará seu contato para entender o projeto.
                  </p>
                </div>
              ) : (
                // ✅ MODO PRODUTO/VENDA: Botões Comprar/Carrinho
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-none"
                    onClick={handleBuyNow} // Redireciona para /checkout
                  >
                    <CreditCardIcon className="h-6 w-6" />
                    Comprar Agora
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full h-14 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 font-bold rounded-xl flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              )}
            </div>

            {/* === Benefícios Padrão (COM ESPAÇAMENTO AUMENTADO) === */}
            {/* Adicionado 'mt-10' e 'pt-6' para separar dos botões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                Garantia de Qualidade
              </div>
              {!isQuote && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                  <TruckIcon className="h-5 w-5 text-green-500" />
                  Envio Imediato Digital
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
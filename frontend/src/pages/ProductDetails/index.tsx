import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { PaymentButton } from '../../components/checkout/PaymentButton'; // Certifique-se que este componente existe
import { formatPrice } from '../../utils/helpers';
import { 
  ChevronLeftIcon, 
  CheckBadgeIcon, 
  ChatBubbleLeftRightIcon, 
  ShoppingCartIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

// Definição da Interface do Produto
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  isConsultation?: boolean; // Campo que define se é orçamento ou venda direta
}

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hooks
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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

  if (loading) return <div className="pt-32 text-center text-white">Carregando detalhes...</div>;

  if (!product) return (
    <div className="pt-32 text-center text-white">
      <h2 className="text-2xl font-bold">Serviço não encontrado</h2>
      <Link to="/produtos"><Button variant="ghost" className="mt-4 text-white hover:bg-white/10">Voltar</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb / Voltar */}
        <Link to="/produtos" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-8 transition-colors">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Voltar para soluções
        </Link>

        <div className="lg:grid lg:grid-cols-2 gap-12">
          
          {/* COLUNA ESQUERDA: Imagem */}
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              crossOrigin="anonymous"
            />
            
            {/* Badge de "Sob Medida" se for consultoria */}
            {product.isConsultation && (
              <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                Projeto Personalizado
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: Informações */}
          <div className="flex flex-col h-full mt-10 lg:mt-0 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div>
              <span className="text-sm text-primary font-bold tracking-widest uppercase mb-2 block">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
                {product.name}
              </h1>
              
              {/* Preço */}
              <div className="mb-6">
                {product.isConsultation ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Investimento estimado</span>
                    <span className="text-2xl font-bold text-white">
                      A partir de {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-end gap-4">
                    <span className="text-3xl font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-400 mb-1">
                      à vista
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 w-full mb-6" />

              <p className="text-gray-300 leading-relaxed mb-8 text-lg font-light">
                {product.description || "Solução tecnológica completa desenvolvida para escalar o seu negócio com segurança e eficiência."}
              </p>

              {/* Lista de Benefícios Fixos (Software House) */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckBadgeIcon className="h-5 w-5 text-green-400" />
                  Garantia de qualidade e suporte
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                  Processo seguro e documentado
                </div>
              </div>
            </div>

            {/* ÁREA DE AÇÃO (Botões) */}
            <div className="mt-auto">
              
              {product.isConsultation ? (
                // === MODO ORÇAMENTO (Serviços) ===
                <div className="space-y-4">
                  <Link to="/contato" className="block">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                    >
                      <ChatBubbleLeftRightIcon className="h-6 w-6" />
                      Solicitar Orçamento
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-gray-400">
                    Nossa equipe entrará em contato para entender sua demanda.
                  </p>
                </div>
              ) : (
                // === MODO VENDA DIRETA (Produtos/Cursos) ===
                <div className="flex flex-col gap-4">
                  
                  {/* Botão de Compra Direta (Mercado Pago) */}
                  <PaymentButton product={product} /> 

                  {/* Botão Adicionar ao Carrinho */}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-white/20 text-white hover:bg-white hover:text-gray-900 font-bold rounded-xl"
                    onClick={() => {
                      addToCart(product);
                      alert("Item adicionado ao carrinho!"); // Idealmente usar um Toast
                    }}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Compra processada com segurança pelo Mercado Pago.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
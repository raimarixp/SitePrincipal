import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { PaymentButton } from '../../components/checkout/PaymentButton';
import { formatPrice } from '../../utils/helpers';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hooks de contexto
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  if (loading) return <div className="pt-32 text-center">Carregando detalhes...</div>;

  if (!product) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold">Produto não encontrado</h2>
      <Link to="/produtos"><Button variant="ghost" className="mt-4">Voltar</Button></Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumb / Voltar */}
        <Link to="/produtos" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Voltar para produtos
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imagem do Produto */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* Informações */}
          <div className="flex flex-col h-full">
            <div>
              <span className="text-sm text-primary font-semibold tracking-wide uppercase">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                {product.name}
              </h1>
              
              {/* Preço só aparece se não for apenas orçamento */}
              {!product.isQuoteOnly && (
                <div className="flex items-end gap-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 mb-2">
                    Em até 12x de {formatPrice(product.price / 12)}
                  </span>
                </div>
              )}

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="border-t border-b border-gray-200 py-6 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Disponibilidade:</span>
                  <span className="text-green-600 font-semibold">
                    {product.stock > 0 ? 'Em Estoque' : 'Sob Encomenda'}
                  </span>
                </div>
              </div>
            </div>

            {/* ÁREA DE AÇÃO (Botões) - Fixado e Unificado */}
            <div className="mt-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  {product.isQuoteOnly ? (
                    // === MODO ORÇAMENTO ===
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary-hover h-12 text-lg"
                      onClick={() => {
                        if (!user) {
                           // Se não estiver logado, manda pro login salvando de onde veio
                           navigate('/login', { state: { from: location } });
                           return;
                        }
                        // Lógica de Orçamento (Futuro: Abrir Modal ou Salvar no Firestore)
                        console.log("Solicitar orçamento para:", product.name);
                        alert("Solicitação enviada! Entraremos em contato em breve.");
                      }}
                    >
                      Solicitar Orçamento
                    </Button>
                  ) : (
                    // === MODO COMPRA (E-COMMERCE) ===
                    <div className="flex flex-col gap-3">
                      {/* Compra Direta (Mercado Pago) */}
                      <PaymentButton product={product} /> 

                      {/* Adicionar ao Carrinho */}
                      <Button 
                        variant="outline" 
                        className="w-full h-12"
                        onClick={() => {
                          addToCart(product);
                          // Feedback visual simples (pode ser melhorado com um Toast notification)
                          alert("Produto adicionado ao carrinho!");
                        }}
                      >
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {!product.isQuoteOnly && (
                <p className="mt-4 text-xs text-center text-gray-500">
                  Compra 100% segura processada pelo Mercado Pago.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
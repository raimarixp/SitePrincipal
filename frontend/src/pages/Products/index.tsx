import { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ProductCard } from '../../components/ui/Card/ProductCard';
import { FilterSidebar } from '../../components/sections/ProductsSection/FilterSidebar';
// 👇 MUDANÇA 1: Importamos o Firestore diretamente para usar o tempo real
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Product } from '../../types'; // Certifique-se que o type existe ou defina aqui
import { Button } from '../../components/ui/Button';

// Se não tiver o type Product global, descomente abaixo:
/*
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
}
*/

export const Products = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de Filtro
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  // 👇 MUDANÇA 2: useEffect com onSnapshot (Tempo Real)
  useEffect(() => {
    // Cria uma conexão direta com o banco
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setProducts(productsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar produtos:", error);
      setIsLoading(false);
    });

    // Função de limpeza: encerra a conexão quando o usuário sai da página
    return () => unsubscribe();
  }, []);

  // Lógica de Filtragem e Ordenação
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filtro de Categoria
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Ordenação
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, sortOption]);

  return (
    <div className="min-h-screen relative z-10 pt-32 pb-24">
      <div>
        
        {/* Mobile Filter Dialog */}
        <Dialog as="div" className="relative z-50 lg:hidden" open={mobileFiltersOpen} onClose={setMobileFiltersOpen}>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-900 border-l border-white/10 py-4 pb-12 shadow-2xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold text-white">Filtros</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-white"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 px-4">
                 <FilterSidebar 
                   idPrefix="mobile"
                   selectedCategory={selectedCategory} 
                   onSelectCategory={(cat) => {
                     setSelectedCategory(cat);
                     setMobileFiltersOpen(false);
                   }}
                   className="block lg:hidden !bg-transparent !border-none !p-0 !shadow-none"
                 />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Cabeçalho da Página */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/20 pb-8 mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
                Nossos Produtos
              </h1>
              <p className="mt-2 text-gray-200 text-lg">
                Explore nossa coleção completa com as melhores ofertas.
              </p>
            </div>

            <div className="flex items-center self-end md:self-auto">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="mr-4 border border-white/20 rounded-lg py-2 px-3 text-sm font-medium text-white hover:bg-white/10 focus:ring-primary focus:border-primary bg-black/30 cursor-pointer [&>option]:text-black"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-white hover:text-gray-300 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filtros</span>
                <FunnelIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              
              {/* Sidebar Desktop */}
              <div className="hidden lg:block sticky top-24 h-fit">
                 <FilterSidebar 
                  idPrefix="desktop"
                  selectedCategory={selectedCategory} 
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Grid de Produtos */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-[400px] border border-white/10"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 xl:gap-x-8">
                        {filteredProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-black/40 rounded-3xl backdrop-blur-md border border-white/10">
                        <p className="text-white text-xl font-bold mb-2">Nenhum produto encontrado</p>
                        <p className="text-gray-300 mb-6">Tente mudar os filtros ou a categoria.</p>
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-primary"
                          onClick={() => setSelectedCategory(null)}
                        >
                          Limpar Filtros
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
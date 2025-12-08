import { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react'; // Para mobile
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ProductCard } from '../../components/ui/Card/ProductCard';
import { FilterSidebar } from '../../components/sections/ProductsSection/FilterSidebar';
import { getProducts } from '../../services/api';
import type { Product } from '../../types';
import { Button } from '../../components/ui/Button';

export const Products = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de Filtro
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  // Carregar dados
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
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
    <div className="bg-white min-h-screen">
      <div>
        {/* Mobile Filter Dialog (Drawer) */}
        <Dialog as="div" className="relative z-40 lg:hidden" open={mobileFiltersOpen} onClose={setMobileFiltersOpen}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Reutilizando a lógica do Sidebar no Mobile */}
              <div className="mt-4 px-4">
                 <FilterSidebar 
                 idPrefix="mobile"
                    selectedCategory={selectedCategory} 
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat);
                      setMobileFiltersOpen(false); // Fecha ao selecionar
                    }}
                    className="block lg:hidden" // Força display block no mobile
                 />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Nossos Produtos</h1>

            <div className="flex items-center">
              {/* Sort Dropdown Simples */}
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="mr-4 border-none text-sm font-medium text-gray-700 hover:text-gray-900 focus:ring-0 bg-transparent"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filtros</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              
              {/* Desktop Filters */}
              <FilterSidebar 
              idPrefix="desktop"
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory}
              />

              {/* Product Grid */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  // Skeleton Loading
                  <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
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
                      <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
                        <Button 
                          variant="ghost" 
                          className="mt-4"
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
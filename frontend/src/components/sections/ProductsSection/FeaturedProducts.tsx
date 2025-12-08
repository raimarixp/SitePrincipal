import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../../types';
import { ProductCard } from '../../ui/Card/ProductCard';
import { Button } from '../../ui/Button';
import { Link } from 'react-router-dom';

// MOCK DATA - DEPOIS VIRÁ DO FIREBASE
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Headphone Noise Cancelling Pro',
    description: 'Isolamento acústico premium.',
    price: 1299.90,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
    category: 'Eletrônicos',
    featured: true,
    stock: 10
  },
  {
    id: '2',
    name: 'Smartwatch Series 5',
    description: 'Monitore sua saúde com precisão.',
    price: 899.00,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
    category: 'Acessórios',
    featured: true,
    stock: 5
  },
  {
    id: '3',
    name: 'Câmera DSLR Profissional',
    description: 'Capture momentos inesquecíveis.',
    price: 4500.00,
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600'],
    category: 'Fotografia',
    featured: true,
    stock: 2
  },
  {
    id: '4',
    name: 'Teclado Mecânico RGB',
    description: 'Performance máxima para devs e gamers.',
    price: 450.00,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b91a05c?auto=format&fit=crop&q=80&w=600'],
    category: 'Periféricos',
    featured: false,
    stock: 15
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Destaques da Loja</h2>
            <p className="text-gray-500">Produtos selecionados com ofertas exclusivas para você.</p>
          </div>
          <Link to="/produtos" className="hidden md:block">
            <Button variant="ghost" className="gap-2">
              Ver todos <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" className="w-full">
            Ver todos os produtos
          </Button>
        </div>
      </div>
    </section>
  );
};
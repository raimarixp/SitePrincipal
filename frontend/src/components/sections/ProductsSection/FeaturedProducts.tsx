import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ProductCard } from '../../ui/Card/ProductCard';
import { Button } from '../../ui/Button';

// Interface para garantir a tipagem correta
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

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Busca a coleção 'products' no Firestore, limitando a 4 itens
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar soluções:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    // 'relative z-10' garante que fique ACIMA do Liquid Gradient
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho da Seção */}
        <div className="flex justify-between items-end mb-12">
          <div>
             {/* Badge com efeito de vidro (Glassmorphism) */}
             <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
               Nossas Soluções
             </span>
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-sm mb-2">
              Tecnologia para escalar seu negócio
            </h2>
            <p className="text-gray-200 font-medium opacity-90 max-w-lg leading-relaxed">
              Softwares de gestão, sites institucionais e aplicativos desenvolvidos sob medida para sua empresa.
            </p>
          </div>
          
          <Link 
            to="/produtos" 
            className="hidden md:flex items-center text-white font-bold hover:text-primary-300 gap-2 group transition-all"
          >
            Ver catálogo completo 
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* LOADING STATE - Esqueleto enquanto carrega */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="bg-white/5 rounded-2xl h-[400px] animate-pulse border border-white/10" />
             ))}
           </div>
        ) : (
          /* GRID DE PRODUTOS REAIS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Botão Mobile */}
        <div className="mt-12 text-center md:hidden">
          <Link to="/produtos">
             <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 border-none font-bold shadow-lg uppercase tracking-wide">
               Ver todas as soluções
             </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
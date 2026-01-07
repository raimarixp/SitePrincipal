import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  PresentationChartLineIcon,
  ArchiveBoxIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, services: 0, portfolio: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => doc.data());
        setStats({
          total: items.length,
          services: items.filter(i => i.requiresQuote === true).length,
          portfolio: items.filter(i => i.category === 'Modelos').length,
          products: items.filter(i => !i.requiresQuote && i.category !== 'Modelos').length
        });
      } catch (error) {
        console.error("Erro stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Card com Gradiente Moderno
  const StatCard = ({ title, value, icon: Icon, gradient, link }: any) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-lg text-white ${gradient} group transition-all hover:scale-[1.02]`}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-4xl font-bold">{loading ? '...' : value}</h3>
          
          {link && (
            <Link to={link} className="mt-4 inline-flex items-center text-xs font-semibold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
              Ver detalhes &rarr;
            </Link>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-12 bg-slate-50">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho de Boas Vindas */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
            <p className="text-slate-500 mt-1">Visão geral do desempenho da sua loja.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sistema Online
          </div>
        </div>

        {/* Grid de Estatísticas (GRADIENTES APLICADOS AQUI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Cadastrado" 
            value={stats.total} 
            icon={ArchiveBoxIcon} 
            gradient="bg-gradient-to-br from-slate-800 to-slate-900" 
            link="/admin/produtos" 
          />
          <StatCard 
            title="Serviços (Orçamento)" 
            value={stats.services} 
            icon={PresentationChartLineIcon} 
            gradient="bg-gradient-to-br from-blue-500 to-blue-700" 
          />
          <StatCard 
            title="Portfólio (Modelos)" 
            value={stats.portfolio} 
            icon={CurrencyDollarIcon} 
            gradient="bg-gradient-to-br from-purple-500 to-purple-700" 
          />
          <StatCard 
            title="Produtos (Venda)" 
            value={stats.products} 
            icon={ShoppingBagIcon} 
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" 
          />
        </div>

        {/* Seção de Ações Rápidas - Estilo "Glass" Clean */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
          Ações Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. CARD DE PEDIDOS (DESTAQUE) */}
          <Link to="/admin/pedidos" className="group">
            <div className="h-full bg-white rounded-2xl shadow-sm p-8 border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-1 transition-transform">
                  <ClipboardDocumentCheckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Gerenciar Pedidos</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Acompanhe vendas em tempo real, aprove pagamentos e despache produtos.
                </p>
                <span className="mt-auto text-blue-600 font-bold text-sm group-hover:underline">Acessar Painel &rarr;</span>
              </div>
            </div>
          </Link>

          {/* 2. CARD DE CATÁLOGO */}
          <Link to="/admin/produtos" className="group">
            <div className="h-full bg-white rounded-2xl shadow-sm p-8 border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-1 transition-transform">
                  <ArchiveBoxIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Catálogo de Produtos</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Adicione novos produtos, edite preços e gerencie o estoque da loja.
                </p>
                <span className="mt-auto text-slate-800 font-bold text-sm group-hover:underline">Gerenciar &rarr;</span>
              </div>
            </div>
          </Link>

          {/* 3. CARD VER SITE */}
          <Link to="/" target="_blank" className="group">
            <div className="h-full bg-white rounded-2xl shadow-sm p-8 border border-slate-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-1 transition-transform">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Loja Online</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Visualize a experiência do cliente e teste novas funcionalidades.
                </p>
                <span className="mt-auto text-green-600 font-bold text-sm group-hover:underline">Acessar Site &rarr;</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};
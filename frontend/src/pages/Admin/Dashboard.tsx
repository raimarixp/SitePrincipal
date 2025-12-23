import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  PresentationChartLineIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    services: 0,
    portfolio: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => doc.data());

        const newStats = {
          total: items.length,
          // Conta itens marcados como orçamento (Serviços)
          services: items.filter(i => i.requiresQuote === true).length,
          // Conta itens da categoria Modelos (Portfólio)
          portfolio: items.filter(i => i.category === 'Modelos').length,
          // O resto são produtos de venda direta
          products: items.filter(i => !i.requiresQuote && i.category !== 'Modelos').length
        };

        setStats(newStats);
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, link }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between group hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{loading ? '...' : value}</h3>
        {link && (
          <Link to={link} className="text-xs font-semibold text-primary mt-2 inline-block hover:underline">
            Ver detalhes &rarr;
          </Link>
        )}
      </div>
      <div className={`p-4 rounded-full ${color} text-white`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Visão Geral</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Cadastrado" 
            value={stats.total} 
            icon={ArchiveBoxIcon} 
            color="bg-gray-900" 
            link="/admin/produtos" // Link para a tabela
          />
          <StatCard 
            title="Serviços (Orçamento)" 
            value={stats.services} 
            icon={PresentationChartLineIcon} 
            color="bg-blue-600" 
          />
          <StatCard 
            title="Portfólio (Modelos)" 
            value={stats.portfolio} 
            icon={CurrencyDollarIcon} 
            color="bg-purple-600" 
          />
          <StatCard 
            title="Produtos (Venda)" 
            value={stats.products} 
            icon={ShoppingBagIcon} 
            color="bg-green-600" 
          />
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <h3 className="text-lg font-bold mb-4">Gerenciar Catálogo</h3>
            <p className="text-gray-500 mb-6">Adicione, edite ou remova produtos, serviços e itens do portfólio.</p>
            <Link to="/admin/produtos">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover w-full sm:w-auto">
                Ir para Produtos
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <h3 className="text-lg font-bold mb-4">Ver Site</h3>
            <p className="text-gray-500 mb-6">Visualize como seu site está aparecendo para os clientes agora.</p>
            <Link to="/" target="_blank">
              <button className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 w-full sm:w-auto">
                Acessar Loja
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
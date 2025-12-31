import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  ArrowTopRightOnSquareIcon, 
  SparklesIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';

export interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  demoUrl?: string; 
  tags?: string[];
}

export const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const productsRef = collection(db, 'products');
        // Buscando itens marcados como 'Modelos'
        const q = query(productsRef, where('category', '==', 'Modelos'));
        
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as PortfolioItem));
        
        setProjects(data);
      } catch (error) {
        console.error("Erro ao buscar portfólio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-12">
      <div className="container mx-auto px-6">
        
        {/* === HERO SECTION === */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6 backdrop-blur-sm">
            <SparklesIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-200">Experiência Digital</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Trabalhos</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            Conheça nossa capacidade técnica através de projetos reais e templates exclusivos. 
            Cada pixel pensado para converter e encantar.
          </p>
        </div>

        {/* === GRID DE PROJETOS === */}
        {loading ? (
          <div className="min-h-[400px]">
            <Loading />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-gray-800/30 rounded-3xl border border-gray-700/50 backdrop-blur-sm max-w-2xl mx-auto">
            <GlobeAltIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ainda estamos populando o portfólio</h3>
            <p className="text-gray-400">Em breve adicionaremos nossos modelos exclusivos aqui!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <div key={project.id} className="group flex flex-col bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                
                {/* Janela do Navegador (Visual Mockup) */}
                <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden group">
                  {/* Barra fake de browser */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md flex items-center px-4 gap-2 z-20 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>

                  {/* Imagem do Projeto */}
                  {/* Correção do src da imagem para evitar warning */}
                  <img 
                    src={(project.images && project.images[0]) ? project.images[0] : '/placeholder.jpg'} 
                    alt={project.name} 
                    className="w-full h-full object-cover pt-8 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 object-top"
                  />

                  {/* Overlay com Ações (Aparece no Hover) */}
                  <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 text-center z-30">
                    <h3 className="text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 text-white">
                      {project.name}
                    </h3>
                    
                    <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 w-full justify-center">
                      
                      {/* 🔥 AQUI ESTÁ A MUDANÇA PRINCIPAL 🔥 */}
                      {/* Link para o Visualizador Interno (DemoViewer) */}
                      {project.demoUrl && (
                        <Link 
                          to={`/visualizar/${project.id}`} 
                          className="w-full max-w-[200px]"
                        >
                          <Button className="w-full bg-white text-gray-900 hover:bg-gray-200 border-none font-bold px-6 py-2 rounded-full flex items-center justify-center gap-2">
                            <GlobeAltIcon className="w-5 h-5" />
                            Ver Online
                          </Button>
                        </Link>
                      )}
                      
                    </div>
                  </div>
                </div>

                {/* Info do Card */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <div className="flex gap-2 text-gray-500">
                      <ComputerDesktopIcon className="w-5 h-5" title="Responsivo Desktop" />
                      <DevicePhoneMobileIcon className="w-5 h-5" title="Responsivo Mobile" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                    {project.description}
                  </p>

                  <div className="mt-auto">
                    {/* Botão para comprar/ver detalhes do PRODUTO */}
                    <Link to={`/produtos/${project.id}`} className="block">
                      <button className="w-full py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-white hover:text-gray-900 hover:border-white transition-all font-medium flex items-center justify-center gap-2 group/btn">
                        Quero um site assim
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { motion } from 'framer-motion'; // Importando animação
import { 
  ArrowTopRightOnSquareIcon, 
  SparklesIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { LiquidGradient } from '../../components/ui/LiquidGradient';

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
        // Mantendo a busca por 'Modelos' ou 'Projetos'
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
    <div className="relative min-h-screen bg-black text-white pt-28 pb-12 overflow-hidden">
      
      {/* === FUNDO ANIMADO (Apenas nesta página) === */}
      <div className="fixed inset-0 z-0">
        <LiquidGradient />
      </div>
      
      {/* Overlay Escuro para legibilidade */}
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">
        
        {/* === HERO SECTION === */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <SparklesIcon className="w-5 h-5 text-[#0077FF]" />
            <span className="text-gray-200">Experiência Digital Imersiva</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
          >
            NOSSOS <span className="text-[#0077FF]">PROJETOS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl leading-relaxed"
          >
            Engenharia de software e design de alto nível. 
            Cada projeto é construído para performance e impacto visual.
          </motion.p>
        </div>

        {/* === GRID DE PROJETOS === */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loading />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-[#111111]/80 rounded-3xl border border-gray-800 backdrop-blur-sm max-w-2xl mx-auto">
            <GlobeAltIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Carregando Projetos...</h3>
            <p className="text-gray-400">Estamos concretando a base de dados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-[#111111] rounded-xl overflow-hidden border border-gray-800 hover:border-[#0077FF] transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,119,255,0.15)]"
              >
                
                {/* Janela do Navegador (Visual Mockup) */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden group">
                  {/* Barra fake de browser */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-md flex items-center px-4 gap-2 z-20 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>

                  {/* Imagem do Projeto */}
                  <img 
                    src={(project.images && project.images[0]) ? project.images[0] : '/placeholder.jpg'} 
                    alt={project.name} 
                    className="w-full h-full object-cover pt-8 transition-transform duration-700 group-hover:scale-110 object-top opacity-80 group-hover:opacity-100"
                  />

                  {/* Overlay com Ações */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 text-center z-30">
                    <h3 className="text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 text-white">
                      {project.name}
                    </h3>
                    
                    <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 w-full justify-center">
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full max-w-[200px]"
                        >
                          <Button className="w-full bg-[#0077FF] text-white hover:bg-[#0055CC] border-none font-bold px-6 py-2 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,119,255,0.4)]">
                            <GlobeAltIcon className="w-5 h-5" />
                            Ver Online
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info do Card */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#0077FF] uppercase tracking-wider bg-[#0077FF]/10 px-3 py-1 rounded-full border border-[#0077FF]/20">
                      {project.category}
                    </span>
                    <div className="flex gap-2 text-gray-500">
                      <ComputerDesktopIcon className="w-5 h-5 hover:text-white transition-colors" />
                      <DevicePhoneMobileIcon className="w-5 h-5 hover:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#0077FF] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                    {project.description}
                  </p>

                  <div className="mt-auto">
                    {/* Botão leva para Contato agora */}
                    <Link to="/contato" className="block">
                      <button className="w-full py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 group/btn">
                        Solicitar Orçamento
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
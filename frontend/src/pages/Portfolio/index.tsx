import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { LiquidGradient } from '../../components/ui/LiquidGradient';
import toast from 'react-hot-toast';

export interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  visualCategory?: string;
  demoUrl?: string; 
  tags?: string[];
}

export const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // === SISTEMA DE ADMIN ===
  const auth = useAuth();
  const user = auth?.user ?? null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visualCategory: 'E-commerce',
    demoUrl: '',
    imageUrl: ''
  });

  const fetchPortfolio = async () => {
    try {
      const productsRef = collection(db, 'products');
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

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro verificação admin", error);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      toast.error("Nome e Imagem são obrigatórios!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        description: formData.description,
        category: 'Modelos',
        visualCategory: formData.visualCategory,
        demoUrl: formData.demoUrl,
        images: [formData.imageUrl],
        createdAt: new Date()
      });
      
      toast.success("Projeto adicionado com sucesso!");
      setShowAddModal(false);
      
      setFormData({ name: '', description: '', visualCategory: 'E-commerce', demoUrl: '', imageUrl: '' });
      fetchPortfolio(); 
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      toast.error("Falha ao salvar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-28 pb-12 overflow-hidden">
      
      {/* Fundo Animado */}
      <div className="fixed inset-0 z-0">
        <LiquidGradient />
      </div>
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8"
          >
            Engenharia de software e design de alto nível. 
            Cada projeto é construído para performance e impacto visual.
          </motion.p>

          {isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#0077FF] hover:bg-[#0055CC] text-white font-bold border-none flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(0,119,255,0.4)]"
              >
                <PlusIcon className="w-5 h-5" /> Adicionar Novo Demo
              </Button>
            </motion.div>
          )}
        </div>

        {/* GRID DE PROJETOS */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loading />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-[#111111]/80 rounded-3xl border border-gray-800 backdrop-blur-sm max-w-2xl mx-auto">
            <GlobeAltIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ainda não há projetos públicos.</h3>
            <p className="text-gray-400">Em breve adicionaremos nossos cases aqui.</p>
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
                
                {/* === CARD INTEIRO É UM LINK === */}
                <a 
                  href={project.demoUrl || '#'} 
                  target={project.demoUrl ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  className="flex flex-col h-full cursor-pointer"
                  onClick={(e) => !project.demoUrl && e.preventDefault()} // Impede clique se não tiver link
                >
                  
                  {/* Imagem Mockup */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-md flex items-center px-4 gap-2 z-20 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>

                    <img 
                      src={(project.images && project.images[0]) ? project.images[0] : '/placeholder.jpg'} 
                      alt={project.name} 
                      className="w-full h-full object-cover pt-8 transition-transform duration-700 group-hover:scale-110 object-top opacity-80 group-hover:opacity-100"
                    />

                    {/* Overlay Ações */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 text-center z-30">
                      <h3 className="text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 text-white">
                        {project.name}
                      </h3>
                      
                      <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 w-full justify-center">
                        {project.demoUrl ? (
                          // Botão Visual (agora é uma Div em vez de Button para evitar Button dentro de A)
                          <div className="w-full max-w-[200px] bg-[#0077FF] text-white hover:bg-[#0055CC] font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,119,255,0.4)] transition-colors">
                            <GlobeAltIcon className="w-5 h-5" />
                            Acessar Site
                          </div>
                        ) : (
                          <div className="w-full max-w-[200px] bg-gray-800 text-gray-400 font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                            Em Breve
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#0077FF] uppercase tracking-wider bg-[#0077FF]/10 px-3 py-1 rounded-full border border-[#0077FF]/20">
                        {project.visualCategory || project.category}
                      </span>
                      <div className="flex gap-2 text-gray-500">
                        <ComputerDesktopIcon className="w-5 h-5 hover:text-[#0077FF] transition-colors" />
                        <DevicePhoneMobileIcon className="w-5 h-5 hover:text-[#0077FF] transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#0077FF] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                      {project.description}
                    </p>
                  </div>

                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* === MODAL DE ADICIONAR PROJETO === */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#0A0A0A] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Novo Demo (Portfólio)</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nome do Projeto *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0077FF]" placeholder="Ex: E-commerce Esportivo" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Categoria Visual</label>
                  <input type="text" value={formData.visualCategory} onChange={e => setFormData({...formData, visualCategory: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0077FF]" placeholder="Ex: SaaS, Landing Page, E-commerce..." />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Link da Imagem (URL) *</label>
                  <input required type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0077FF]" placeholder="https://i.ibb.co/..." />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Link do Site / Demo (Opcional)</label>
                  <input type="url" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0077FF]" placeholder="https://seudemo.com" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Breve Descrição</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0077FF] resize-none" placeholder="Descrição curta do projeto..."></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="bg-transparent border-gray-700 text-gray-300">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#0077FF] hover:bg-[#0055CC] text-white border-none">
                    {isSubmitting ? 'Salvando...' : 'Salvar Projeto'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
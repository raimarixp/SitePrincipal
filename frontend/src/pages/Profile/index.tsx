import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// Importação das Abas (Vamos criar esses arquivos no próximo passo)
import { MyProjects } from './tabs/MyProjects';
import { Settings } from './tabs/Settings';

const MENU_ITEMS = [
  { id: 'projects', label: 'Meus Projetos', icon: Squares2X2Icon },
  { id: 'settings', label: 'Configurações', icon: Cog6ToothIcon },
];

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-12 px-4 md:px-8">
      
      {/* Background Sutil */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR (NAVEGAÇÃO) --- */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card do Usuário */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 p-1 mb-4 shadow-xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                   <UserCircleIcon className="w-10 h-10 text-neutral-500" />
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg">{user?.displayName || 'Visitante'}</h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">{user?.email}</p>
          </div>

          {/* Menu de Navegação */}
          <nav className="p-2 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            {MENU_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {/* Fundo Ativo (Glass) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                    />
                  )}
                  
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium text-sm relative z-10">{item.label}</span>
                </button>
              );
            })}

            <div className="h-px bg-white/5 my-2 mx-4" />

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Sair</span>
            </button>
          </nav>

        </div>

        {/* --- ÁREA DE CONTEÚDO --- */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[500px]"
            >
              {activeTab === 'projects' && <MyProjects />}
              {activeTab === 'settings' && <Settings user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
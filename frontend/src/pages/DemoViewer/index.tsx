import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Loading } from '../../components/ui/Loading';

export const DemoViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca a URL do demo baseada no ID do produto
  useEffect(() => {
    const fetchDemoUrl = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().demoUrl) {
          setDemoUrl(docSnap.data().demoUrl);
        } else {
          alert("Este projeto não possui demonstração ativa.");
          navigate(-1);
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemoUrl();
  }, [id, navigate]);

  if (loading) return <Loading fullScreen text="Carregando visualizador..." />;
  if (!demoUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col h-screen w-screen overflow-hidden">
      
      {/* === BARRA DE CONTROLE SUPERIOR === */}
      <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shadow-md shrink-0">
        
        {/* Botão Fechar */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <XMarkIcon className="w-5 h-5" />
            Fechar Preview
          </button>
        </div>

        {/* Seletor de Dispositivo */}
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ComputerDesktopIcon className="w-5 h-5" />
            Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DevicePhoneMobileIcon className="w-5 h-5" />
            Mobile
          </button>
        </div>

        {/* Link Externo (Abrir real) */}
        <div className="flex items-center gap-4">
          <a 
            href={demoUrl} 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Abrir em nova aba
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm">
            Comprar Agora
          </button>
        </div>
      </header>

      {/* === ÁREA DO IFRAME === */}
      <main className="flex-grow bg-slate-900/50 flex justify-center overflow-hidden py-4">
        <div 
          className={`transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden ${
            viewMode === 'mobile' 
              ? 'w-[375px] h-[667px] md:h-[800px] rounded-[3rem] border-8 border-slate-800 ring-1 ring-slate-700 my-auto' // Estilo iPhone
              : 'w-full h-full border-none' // Estilo Fullscreen
          }`}
        >
          <iframe 
            src={demoUrl} 
            title="Demo Preview"
            className="w-full h-full border-none bg-white"
          />
        </div>
      </main>
    </div>
  );
};
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center bg-slate-900 overflow-hidden">
      
      {/* 1. Imagem de Fundo com Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80" 
          alt="Escritório de Advocacia" 
          className="w-full h-full object-cover opacity-20"
        />
        {/* Gradiente para garantir leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* 2. Conteúdo de Texto (Esquerda) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-amber-500 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
            Excelência Jurídica desde 1998
          </span>
          
          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
            Defendendo seus direitos com <span className="text-amber-500 italic">integridade</span> absoluta.
          </h1>
          
          <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed font-sans">
            Especialistas em Direito Civil, Empresarial e Tributário. Soluções jurídicas personalizadas para proteger o seu patrimônio e garantir a justiça.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 font-sans">
            <a 
              href="#contato"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-sm transition-all transform hover:-translate-y-1 shadow-lg shadow-amber-900/20 text-center flex items-center justify-center gap-2"
            >
              Fale com um Especialista
            </a>
            <a 
              href="#areas"
              className="border border-white/20 text-white hover:bg-white/10 font-medium py-4 px-8 rounded-sm transition-all text-center"
            >
              Conheça as Áreas
            </a>
          </div>
        </motion.div>

        {/* 3. Card Flutuante Visual (Direita - Apenas Desktop) */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4, duration: 0.8 }}
           className="hidden md:block justify-self-end"
        >
          <div className="bg-white/5 backdrop-blur-md p-8 border border-white/10 rounded-sm max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                ⚖️
              </div>
              <div>
                <h3 className="text-white font-serif text-xl">Atendimento Urgente</h3>
                <p className="text-slate-400 text-sm font-sans">Plantão criminal e liminares</p>
              </div>
            </div>
            
            <hr className="border-white/10 my-4"/>
            
            <div className="space-y-3 font-sans">
               <p className="text-slate-300 text-sm flex items-center gap-2">
                 <span className="text-amber-500">✓</span> Mais de 1.500 casos resolvidos
               </p>
               <p className="text-slate-300 text-sm flex items-center gap-2">
                 <span className="text-amber-500">✓</span> Equipe multidisciplinar sênior
               </p>
               <p className="text-slate-300 text-sm flex items-center gap-2">
                 <span className="text-amber-500">✓</span> Reconhecido pelo Ranking Análise
               </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-amber-500 cursor-pointer hover:text-amber-400 transition-colors">
                <span className="text-sm font-bold uppercase tracking-wider">Ver estatísticas</span>
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  TrophyIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button';

// --- DADOS ---
const stats = [
  { label: 'Anos de XP', value: '+8', icon: TrophyIcon },
  { label: 'Engenheiros', value: '12', icon: UsersIcon },
];

const benefits = [
  'Desenvolvimento Escalável',
  'Arquitetura Clean Code',
  'Consultoria de Negócio',
  'Suporte Vitalício'
];

export const AboutSection = () => {
  return (
    <section className="relative py-32 bg-neutral-950 overflow-hidden">
      
      {/* === BACKGROUND AMBIENT === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        {/* Glow Lateral para separar da seção anterior */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* === COLUNA DA IMAGEM (ESQUERDA AGORA, PARA ALTERNAR O FLUXO) === */}
          {/* Mover a imagem para a esquerda cria um ritmo visual melhor se a seção anterior era centralizada ou tinha texto na esquerda */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none"
          >
            {/* Elemento Decorativo de Fundo (Moldura) */}
            <div className="absolute -inset-4 border border-white/10 rounded-[2.5rem] bg-white/[0.01] backdrop-blur-sm -z-10" />
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] group">
              {/* Overlay de Cor para unificar a foto com o tema */}
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
              
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Equipe de desenvolvimento" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
              />

              {/* Card Flutuante (Glass) */}
              <div className="absolute bottom-6 left-6 right-6 bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl z-20">
                <div className="flex justify-between items-center divide-x divide-white/10">
                   {stats.map((stat, idx) => (
                     <div key={idx} className={`flex-1 ${idx === 0 ? 'pr-4' : 'pl-4'} flex items-center gap-3`}>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
                          <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* === COLUNA DE TEXTO (DIREITA) === */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
               <span className="text-indigo-300 font-mono text-xs tracking-[0.2em] uppercase">
                  Quem Somos
               </span>
            </div>

            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Mais que código, entregamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">resultados reais</span>.
            </h3>
            
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              Nascemos com a missão de democratizar a tecnologia de ponta. 
              Nossa equipe é formada por especialistas ex-big tech prontos para 
              transformar sua visão em um ecossistema digital robusto e escalável.
            </p>

            {/* Grid de Benefícios Moderno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-colors group">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-neutral-300 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sobre">
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-none w-full sm:w-auto">
                  Conheça Nossa História
                </Button>
              </Link>
              
              <Link to="/portfolio">
                 <button className="group flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all w-full sm:w-auto">
                    Ver Portfolio
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
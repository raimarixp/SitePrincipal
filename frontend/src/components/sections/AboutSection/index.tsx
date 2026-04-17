import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button'; // Ajuste o caminho do seu Button se necessário

// --- DADOS ---
const benefits = [
  'Desenvolvimento Escalável',
  'Arquitetura Clean Code',
  'Consultoria de Negócio',
  'Suporte Vitalício'
];

const testimonials = [
  {
    id: 1,
    quote: "A equipe transformou nossa operação. O novo sistema é incrivelmente rápido e a arquitetura escalável nos permitiu dobrar de tamanho.",
    author: "Rafael M.",
    role: "Empresário da Área de e-commerce",
    avatar: "https://ui-avatars.com/api/?name=Rafael+M&background=3C26F6&color=fff"
  },
  {
    id: 2,
    quote: "Profissionalismo impecável. O site antigo demorava 8 segundos para carregar, agora abre em menos de 1 segundo. A conversão disparou.",
    author: "Carla S.",
    role: "Diretora de Marketing",
    avatar: "https://ui-avatars.com/api/?name=Carla+S&background=111111&color=7A6AFA"
  }
];

export const AboutSection = () => {
  return (
    <section className="relative py-32 bg-neutral-950 overflow-hidden font-sans">
      
      {/* === BACKGROUND AMBIENT === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        {/* Glow Lateral usando a nova cor principal */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#3C26F6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* === COLUNA DE DEPOIMENTOS (ESQUERDA) === */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-lg lg:max-w-none flex flex-col gap-6 relative"
          >
            {/* Decoração de fundo para unir os cards */}
            <div className="absolute -inset-8 bg-gradient-to-b from-[#3C26F6]/5 to-transparent blur-2xl rounded-[3rem] -z-10" />

            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative p-8 rounded-3xl bg-neutral-900/50 backdrop-blur-md border border-white/5 shadow-xl group hover:border-[#3C26F6]/30 transition-all duration-300"
              >
                {/* Ícone de Aspas Gigante e Translúcido de Fundo */}
                <div className="absolute top-4 right-6 text-9xl text-white/[0.02] font-serif leading-none select-none pointer-events-none group-hover:text-[#3C26F6]/5 transition-colors duration-500">
                  "
                </div>

                {/* Estrelas */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-[#7A6AFA] fill-[#7A6AFA]" />
                  ))}
                </div>

                <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-6 italic relative z-10">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4 relative z-10">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-[#3C26F6]/50 transition-colors"
                  />
                  <div>
                    <h4 className="text-white font-bold text-sm">{testimonial.author}</h4>
                    <p className="text-neutral-500 text-xs uppercase tracking-wider mt-0.5 font-mono">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* === COLUNA DE TEXTO (DIREITA) === */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            {/* Badge atualizada com as novas cores */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3C26F6]/10 border border-[#3C26F6]/20 mb-6">
               <span className="w-1.5 h-1.5 rounded-full bg-[#7A6AFA] animate-pulse" />
               <span className="text-[#7A6AFA] font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold">
                 Quem Somos
               </span>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black italic text-white mb-6 tracking-tighter leading-[1.1]">
              Mais que código, entregamos <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#3C26F6] to-indigo-400">resultados reais</span>.
            </h3>
            
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed font-light">
              Nascemos com a missão de democratizar a tecnologia de ponta. 
              Nossa equipe é formada por engenheiros e designers prontos para 
              transformar sua visão em um ecossistema digital robusto e escalável.
            </p>

            {/* Grid de Benefícios Moderno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#3C26F6]/30 transition-all duration-300 group hover:bg-white/[0.04]">
                  <CheckCircleIcon className="h-5 w-5 text-[#3C26F6] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-neutral-300 font-medium text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sobre" className="w-full sm:w-auto">
                {/* Botão atualizado para Blurple */}
                <Button size="lg" className="rounded-full bg-[#3C26F6] hover:bg-[#2D18E5] text-white shadow-[0_0_25px_rgba(60,38,246,0.4)] border-none w-full">
                  Conheça Nossa História
                </Button>
              </Link>
              
              <Link to="/portfolio" className="w-full sm:w-auto">
                 <button className="group flex items-center justify-center gap-2 px-8 py-3 h-full rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all w-full font-bold text-sm tracking-wide">
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
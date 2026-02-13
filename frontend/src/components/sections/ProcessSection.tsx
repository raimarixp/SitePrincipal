import { motion } from 'framer-motion';
import { 
  ChatBubbleBottomCenterTextIcon, 
  ClipboardDocumentCheckIcon, 
  ComputerDesktopIcon, 
  CodeBracketSquareIcon, 
  RocketLaunchIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

// --- UTILS (Reutilizando para garantir que funcione isolado) ---

// --- DADOS ---
const steps = [
  {
    id: 1,
    title: 'Alinhamento Estratégico',
    description: 'Nossa equipe mergulha no seu negócio para entender dores, objetivos e o público-alvo da sua demanda.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    id: 2,
    title: 'Briefing & Escopo',
    description: 'Definimos funcionalidades, coletamos referências visuais e blindamos o escopo do projeto.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description: 'Prototipagem de alta fidelidade. Você aprova o visual pixel-perfect antes de codificarmos.',
    icon: ComputerDesktopIcon,
  },
  {
    id: 4,
    title: 'Engineering',
    description: 'Desenvolvimento Clean Code utilizando React, Node.js e arquitetura escalável.',
    icon: CodeBracketSquareIcon,
  },
  {
    id: 5,
    title: 'Quality Assurance',
    description: 'Testes de integração, segurança, performance e SEO técnico para garantir a robustez.',
    icon: WrenchScrewdriverIcon,
  },
  {
    id: 6,
    title: 'Deploy & Growth',
    description: 'Publicação em ambiente produtivo, treinamento da equipe e monitoramento de métricas.',
    icon: RocketLaunchIcon,
  }
];

export const ProcessSection = () => {
  return (
    <section className="relative py-32 bg-neutral-950 overflow-hidden">
      
      {/* === BACKGROUND EFFECTS INTENSO & VAGANDO === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         
         {/* 1. Textura de Ruído (Noise) - Mantém o aspecto físico sobre a luz */}
         <div className="absolute inset-0 opacity-[0.04] z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
         
         {/* 2. FEIXE DE LUZ PRINCIPAL (Azul Ciano Elétrico) 
            Se move mais rápido e é mais brilhante.
         */}
         <motion.div 
            className="absolute top-1/4 left-1/4 w-[70vw] h-[40vh] bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-transparent blur-[120px] rounded-full mix-blend-screen will-change-transform origin-center"
            animate={{
                x: ["-20%", "30%", "-10%", "-20%"],
                y: ["-10%", "20%", "-30%", "-10%"],
                rotate: [0, 20, -10, 0],
                scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            }}
         />

         {/* 3. FEIXE SECUNDÁRIO (Azul Profundo/Roxo)
            Se move em contraponto para dar profundidade.
         */}
         <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[60vw] h-[50vh] bg-gradient-to-l from-blue-700/30 via-indigo-600/30 to-transparent blur-[150px] rounded-full mix-blend-screen will-change-transform origin-center"
            animate={{
                x: ["20%", "-20%", "10%", "20%"],
                y: ["10%", "-30%", "20%", "10%"],
                rotate: [0, -15, 25, 0],
                scale: [1.2, 0.8, 1.1, 1.2]
            }}
            transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 2
            }}
         />

        {/* 4. Ponto de Luz de Contraste (Branco/Azul) - O "Estouro" do Relâmpago */}
        <motion.div
            className="absolute top-0 left-1/2 w-[300px] h-[300px] bg-blue-300/20 blur-[80px] rounded-full mix-blend-overlay"
            animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        
        {/* === HEADER (Mantido com leves ajustes para contraste) === */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
             <span className="text-blue-300 font-mono text-xs tracking-[0.2em] uppercase font-bold">
                Metodologia Ágil
             </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
          >
            Do contato à <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 filter drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">Entrega Final</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 text-lg leading-relaxed font-medium mix-blend-plus-lighter"
          >
            Transformamos complexidade em simplicidade através de um processo transparente, organizado e focado em resultados mensuráveis.
          </motion.p>
        </div>

        {/* === GRID DE CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full"
            >
              {/* Card Container - Aumentei o backdrop-blur e escureci o bg para contraste com a luz forte */}
              <div className="relative h-full bg-neutral-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:bg-neutral-900/80 hover:border-blue-400/50 hover:shadow-[0_0_50px_rgba(37,99,235,0.25)] hover:-translate-y-2">
                
                {/* Efeito de Reflexo "Relâmpago" no Card - Mais intenso */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                
                <span className="absolute -right-4 -top-4 text-9xl font-black text-white/[0.03] group-hover:text-blue-400/[0.08] transition-colors select-none font-sans">
                  0{step.id}
                </span>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-black/20 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 shadow-lg backdrop-blur-sm">
                    <step.icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-200 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
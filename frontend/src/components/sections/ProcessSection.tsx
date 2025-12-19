import { motion } from 'framer-motion';
import { 
  ChatBubbleBottomCenterTextIcon, 
  ClipboardDocumentCheckIcon, 
  ComputerDesktopIcon, 
  CodeBracketSquareIcon, 
  RocketLaunchIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 1,
    title: '1. Alinhamento Estratégico',
    description: 'Nossa equipe entra em contato para entender a fundo a sua demanda e os objetivos do seu negócio.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    id: 2,
    title: '2. Reunião de Briefing',
    description: 'Coletamos todos os detalhes, referências visuais e funcionalidades que seu sistema precisa ter.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: 3,
    title: '3. UI/UX & Prototipagem',
    description: 'Criamos o desenho visual (layout) do projeto para você aprovar antes de escrevermos uma linha de código.',
    icon: ComputerDesktopIcon,
  },
  {
    id: 4,
    title: '4. Desenvolvimento',
    description: 'Nossos engenheiros programam seu site ou sistema utilizando as tecnologias mais modernas do mercado.',
    icon: CodeBracketSquareIcon,
  },
  {
    id: 5,
    title: '5. Integrações & Testes',
    description: 'Conectamos gateways de pagamento, APIs e realizamos testes rigorosos de segurança e performance.',
    icon: WrenchScrewdriverIcon,
  },
  {
    id: 6,
    title: '6. Publicação & Suporte',
    description: 'Seu projeto vai ao ar! Oferecemos treinamento e suporte contínuo para garantir o sucesso da operação.',
    icon: RocketLaunchIcon,
  }
];

export const ProcessSection = () => {
  return (
    <section className="py-24 bg-neutral-900 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-wider uppercase text-sm"
          >
            Metodologia Ágil
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white mt-2"
          >
            Do contato à entrega final
          </motion.h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Entenda como transformamos sua ideia em realidade através de um processo transparente e organizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary transition-all duration-500 rounded-t-2xl" />
              
              <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
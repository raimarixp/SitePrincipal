import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '../../ui/Button';

const benefits = [
  'Desenvolvimento Ágil e Escalável',
  'Equipe de Engenheiros Sênior',
  'Consultoria Estratégica Inclusa',
  'Suporte Técnico Vitalício'
];

export const AboutSection = () => {
  return (
    // 'relative z-10' permite que o gradiente líquido apareça atrás desta seção
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Coluna de Texto: Card Branco para contraste */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">
              Quem Somos
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Mais que código, entregamos <span className="text-primary">resultados</span>
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Nascemos com a missão de democratizar a tecnologia para empresas de todos os portes. 
              Nossa equipe é formada por especialistas em engenharia de software, design e gestão de produtos, 
              prontos para transformar sua ideia em um negócio digital de sucesso.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700 font-medium">
                  <CheckCircleIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/sobre">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                Conheça Nossa História
              </Button>
            </Link>
          </motion.div>

          {/* Coluna de Imagem */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-square border-4 border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Time de desenvolvimento reunido" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Card Flutuante de Estatística */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl hidden md:block border border-gray-100">
                <p className="text-4xl font-black text-primary mb-1">+500</p>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Projetos Entregues</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
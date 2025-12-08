import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '../../ui/Button';

const benefits = [
  'Mais de 10 anos de experiência no mercado',
  'Suporte técnico especializado 24/7',
  'Garantia estendida em todos os produtos',
  'Certificações internacionais de qualidade'
];

export const AboutSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Coluna de Texto */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">
              Nossa História
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Inovação e compromisso com o seu sucesso
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Fundada com a missão de transformar o mercado tecnológico, nossa empresa se destaca por unir produtos de alta performance com um atendimento humanizado. Não vendemos apenas equipamentos; entregamos soluções que impulsionam o seu negócio.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircleIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/sobre">
              <Button size="lg" variant="outline">
                Conheça Nossa Equipe
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Equipe reunida em ambiente moderno" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Card Flutuante (Decorativo) */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-2xl font-bold text-primary">10k+</p>
                <p className="text-sm text-gray-600">Clientes Satisfeitos</p>
              </div>
            </div>
            {/* Elemento Decorativo de Fundo */}
            <div className="absolute -z-10 top-[-20px] right-[-20px] w-full h-full border-2 border-secondary rounded-2xl hidden md:block" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
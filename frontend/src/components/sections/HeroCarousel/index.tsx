import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button';

// Dados dos Slides (Em um projeto real, viriam do Firebase/CMS)
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
    title: 'Soluções Corporativas de Alta Performance',
    subtitle: 'Transforme a gestão da sua empresa com nossa tecnologia de ponta e consultoria especializada.',
    cta: 'Conheça Nossos Planos',
    link: '/produtos'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1920',
    title: 'Inovação que Impulsiona Resultados',
    subtitle: 'Ferramentas integradas para escalar seu negócio com segurança e eficiência.',
    cta: 'Fale com um Consultor',
    link: '/contato'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1920',
    title: 'Suporte Premium 24/7',
    subtitle: 'Nossa equipe de especialistas está sempre pronta para garantir o sucesso da sua operação.',
    cta: 'Saiba Mais',
    link: '/sobre'
  }
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Lógica de Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-neutral-900">
      <AnimatePresence mode='wait'>
        {slides.map((slide, index) => (
          index === current && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              {/* Imagem de Fundo */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay Escuro para legibilidade do texto */}
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Conteúdo do Slide */}
              <div className="relative container mx-auto h-full px-6 flex flex-col justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-3xl space-y-6"
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-neutral-200 max-w-2xl">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4">
                    <Button size="lg" className="bg-primary hover:bg-primary-hover border-none">
                      {slide.cta}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Setas de Navegação (Desktop) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Indicadores (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
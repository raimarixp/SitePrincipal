import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button';

// Dados dos Slides (Adaptados para Software House)
const slides = [
  {
    id: 1,
    // Imagem: Código / Tecnologia
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1920',
    title: 'Transforme seu Negócio com Tecnologia',
    subtitle: 'Desenvolvimento de Sites, Sistemas de Ponto e Softwares sob medida para alavancar sua empresa.',
    cta: 'Conheça Nossas Soluções',
    link: '/produtos'
  },
  {
    id: 2,
    // Imagem: Dashboard / Gestão
    image: 'https://i.ibb.co/WCq34Hw/Gemini-Generated-Image-b6eymyb6eymyb6ey.png',
    title: 'Gestão Inteligente & Ponto Eletrônico',
    subtitle: 'Sistemas completos para RH e controle de ponto com integração biométrica e relatórios em tempo real.',
    cta: 'Ver Sistema de Ponto',
    link: '/produtos' // Ou um link direto para a categoria de sistemas
  },
  {
    id: 3,
    // Imagem: Design / Web
    image: 'https://i.ibb.co/rfNwyk6v/convers-p.png', // Imagem alternativa
    title: 'Sites que Convertem Visitantes em Clientes',
    subtitle: 'Websites institucionais e Landing Pages de alta performance, otimizados para SEO e mobile.',
    cta: 'Solicitar Orçamento',
    link: '/contato'
  }
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Lógica de Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000); // Aumentei levemente para 8s para dar tempo de ler

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
                {/* Overlay Escuro com Gradiente para melhor leitura */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              </div>

              {/* Conteúdo do Slide */}
              <div className="relative container mx-auto h-full px-6 flex flex-col justify-center">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-3xl space-y-6"
                >
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-medium drop-shadow-md leading-relaxed">
                    {slide.subtitle}
                  </p>
                  
                  <div className="pt-6">
                    {/* Envolvi o Button no Link para funcionar a navegação */}
                    <Link to={slide.link}>
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-red-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform border-none"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Setas de Navegação (Desktop) */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hidden md:block border border-white/10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hidden md:block border border-white/10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Indicadores (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              idx === current ? 'bg-primary w-8' : 'bg-white/50 w-2 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Hero } from '../components/Hero'; // Verifique se criou este arquivo
import { PracticeAreas } from '../components/PracticeAreas'; // Verifique se criou este arquivo
import { ContactSection } from '../components/ContactSection';

export const Home = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      
      <div id="areas">
        <PracticeAreas />
      </div>

      {/* Seção Sobre (Inline para agilizar, mas poderia ser componente) */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" 
              alt="Sala de Reunião" 
              className="rounded-sm shadow-2xl"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-serif text-slate-900 mb-6">Compromisso com a Verdade</h2>
            <div className="w-16 h-1 bg-amber-600 mb-6"></div>
            <p className="text-slate-600 mb-6 leading-relaxed font-sans">
              Fundado em 1998, o escritório JusTech nasceu com o propósito de oferecer advocacia artesanal para grandes causas. Acreditamos que cada cliente merece uma atenção personalizada e uma estratégia desenhada sob medida.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed font-sans">
              Nossa equipe é formada por especialistas renomados em suas áreas, garantindo segurança jurídica para o seu patrimônio e sua família.
            </p>
            
            {/* Assinatura visual */}
            <div className="mt-8">
              <p className="font-serif text-2xl text-slate-900 italic">Dr. Carlos Mendes</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Sócio Fundador</p>
            </div>
          </div>
        </div>
      </section>

      <div id="contato">
        <ContactSection />
      </div>
    </>
  );
};
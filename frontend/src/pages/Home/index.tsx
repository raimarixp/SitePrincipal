import { HeroCarousel } from '../../components/sections/HeroCarousel';
import { ValueProposition } from '../../components/sections/ValueProposition';
import { FeaturedProducts } from '../../components/sections/ProductsSection/FeaturedProducts';
import { ProcessSection } from '../../components/sections/ProcessSection'; // 👈 Importe a nova seção
import { AboutSection } from '../../components/sections/AboutSection';
import { Testimonials } from '../../components/sections/Testimonials';
import { ContactCTA } from '../../components/sections/ContactSection/ContactCTA';

export const Home = () => {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
      
      {/* 1. HERO (Topo)
         -mt-4 para compensar possíveis margens e colar no header se necessário
      */}
      <div className="relative z-10 -mt-4">
        <HeroCarousel />
      </div>

      {/* 2. VALUE PROPOSITION (Diferenciais)
         Fundo transparente (Glassmorphism) para o gradiente líquido brilhar atrás
      */}
      <ValueProposition />

      {/* 3. SOLUÇÕES (Produtos/Serviços) 
         Trazemos isso para cima. O cliente quer ver o que você faz primeiro.
         O componente FeaturedProducts já lida com 'relative z-10'.
      */}
      <FeaturedProducts />

      {/* 4. COMO FUNCIONA (Process Workflow) - NOVO 
         Fundo Escuro (bg-neutral-900) definido dentro do componente.
         Cria um contraste forte após a seção transparente.
      */}
      <div className="relative z-10">
        <ProcessSection />
      </div>

      {/* 5. SOBRE NÓS 
         O componente AboutSection agora é um "Card Branco" flutuante.
         Vai ficar lindo sobre o gradiente ou fundo neutro.
      */}
      <AboutSection />

      {/* 6. DEPOIMENTOS 
         Fundo Escuro (bg-neutral-900) para focar na prova social.
      */}
      <div className="relative z-10">
        <Testimonials />
      </div>

      {/* 7. CHAMADA PARA AÇÃO FINAL (Rodapé)
         Fundo sólido para fechar a página.
      */}
      <div className="relative z-10 bg-neutral-900">
        <ContactCTA />
      </div>

    </div>
  );
};
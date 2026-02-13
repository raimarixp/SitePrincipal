import { ScrollyTelling } from '../../components/sections/ScrollyTelling'; // 👈 Nova estrela da página
import { ProcessSection } from '../../components/sections/ProcessSection';
import { AboutSection } from '../../components/sections/AboutSection';
import { ContactCTA } from '../../components/sections/ContactSection/ContactCTA';

export const Home = () => {
  return (
    // Adicionei bg-neutral-950 para garantir fundo escuro consistente em toda a página
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-neutral-950">
      
      {/* 1. SCROLLYTELLING (Nova Hero Section)
          Substitui o carrossel. O usuário começa a navegar e a história se desenrola.
          Não precisa de margem negativa pois ele é o primeiro elemento.
      */}
      <ScrollyTelling />

      {/* 3. COMO FUNCIONA (Process Workflow)
          Mantém o fundo escuro para consistência visual.
      */}
      <div className="relative z-10 bg-neutral-950">
        <ProcessSection />
      </div>

      {/* 4. SOBRE NÓS 
          Card flutuante ou seção destacada.
      */}
      <AboutSection />

      {/* 6. CHAMADA PARA AÇÃO FINAL (Rodapé)
          Fechamento da página.
      */}
      <div className="relative z-10 bg-black">
        <ContactCTA />
      </div>

    </div>
  );
};
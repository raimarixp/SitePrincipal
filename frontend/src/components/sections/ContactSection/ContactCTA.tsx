import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';

export const ContactCTA = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* MUDANÇA: bg-black/40 (Vidro Escuro) para garantir contraste do texto branco */}
        <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl px-6 py-16 text-center sm:px-12 md:px-24">
          
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl mb-6 drop-shadow-sm">
            Pronto para transformar seu negócio?
          </h2>
          
          <p className="mx-auto max-w-xl text-lg text-gray-200 mb-10 opacity-90 leading-relaxed font-medium">
            Nossa equipe de especialistas está pronta para ajudar você a encontrar 
            a solução ideal. Entre em contato hoje mesmo e tire suas dúvidas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contato">
              {/* BOTÃO PRIMÁRIO: Vermelho Vibrante + Texto Preto */}
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-[#FF0000] hover:bg-primary text-black border-none min-w-[180px] font-black shadow-lg hover:scale-105 transition-transform"
              >
                Fale Conosco
              </Button>
            </Link>
            
            <Link to="/produtos">
              {/* BOTÃO SECUNDÁRIO: Borda Branca + Texto Branco (Agora visível no fundo escuro) */}
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 border-2 border-white text-white hover:bg-white hover:text-black min-w-[180px] font-bold backdrop-blur-sm"
              >
                Ver Catálogo
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
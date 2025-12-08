import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';

export const ContactCTA = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para levar seu negócio ao próximo nível?
        </h2>
        <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
          Fale com nossos especialistas hoje mesmo e descubra como podemos ajudar você a alcançar seus objetivos com tecnologia de ponta.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contato">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 border-none w-full sm:w-auto">
              Falar com Consultor
            </Button>
          </Link>
          <Link to="/produtos">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
              Ver Catálogo Completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
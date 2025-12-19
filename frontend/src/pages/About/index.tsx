import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export const About = () => {
  return (
    // 'relative z-10': Garante que o conteúdo flutue sobre o Liquid Gradient
    <div className="py-24 relative z-10">
      
      {/* Cabeçalho da Página (Texto Branco sobre o Gradiente) */}
      <div className="container mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-sm">
          Inovação é o nosso código.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-100 font-medium opacity-90 max-w-2xl mx-auto">
          Somos uma Software House apaixonada por resolver problemas complexos. 
          Unimos engenharia de ponta e design estratégico para levar sua empresa ao próximo nível.
        </p>
      </div>

      {/* Seção Principal */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* COLUNA 1: Texto e Valores (Card Branco para Leitura) */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              Por que escolher nossa tecnologia?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Não entregamos apenas software, entregamos inteligência de negócio. 
              Do sistema de ponto digital à criação de sites institucionais, cada linha de código 
              é pensada para garantir escalabilidade, segurança e performance para sua operação.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Metodologias ágeis e entregas pontuais.',
                'Sistemas blindados com alta segurança de dados.',
                'Suporte técnico especializado e humanizado.',
                'Foco total em ROI (Retorno sobre Investimento).'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/produtos">
                <Button size="lg" className="rounded-full px-8 w-full sm:w-auto shadow-lg font-bold">
                  Ver Nossas Soluções
                </Button>
              </Link>
              <Link to="/contato">
                <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto font-bold border-gray-300 text-gray-700 hover:bg-gray-50">
                  Falar com Consultor
                </Button>
              </Link>
            </div>
          </div>

          {/* COLUNA 2: Imagem Ilustrativa (Ambiente Tech) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white/10">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1632" 
               alt="Equipe de desenvolvimento discutindo projeto" 
               className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
             />
             {/* Overlay sutil */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
             
             {/* Card Flutuante Decorativo */}
             <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg hidden md:block">
                <p className="font-bold text-gray-900">Stack Moderna</p>
                <p className="text-xs text-gray-500">React • Node • Cloud</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
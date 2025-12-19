import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    content: "O sistema de ponto digital revolucionou nosso RH. Reduzimos em 40% o tempo gasto com fechamento de folha e eliminamos erros manuais.",
    author: "Ricardo Mendes",
    role: "Diretor de RH, TechSolution",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    rating: 5
  },
  {
    id: 2,
    content: "O novo site institucional ficou incrível. O design é moderno, rápido e nossas conversões de leads dobraram no primeiro mês.",
    author: "Fernanda Paiva",
    role: "CEO, Marketing Digital Pro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    rating: 5
  },
  {
    id: 3,
    content: "O que mais me impressionou foi o suporte. Sempre que precisamos de uma customização no ERP, a equipe atende prontamente.",
    author: "Carlos Drummond",
    role: "Gerente de Operações, Logística Express",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-neutral-900 text-white relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            O que dizem nossos parceiros
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Histórias reais de empresas que transformaram seus resultados com nossa tecnologia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-700'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-300 mb-8 italic leading-relaxed">
                "{item.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.author} 
                  className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{item.author}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    content: "A qualidade dos produtos superou todas as minhas expectativas. O suporte foi essencial para a implantação na minha empresa.",
    author: "Ricardo Silva",
    role: "CTO da TechSolutions",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    rating: 5
  },
  {
    id: 2,
    content: "Entrega extremamente rápida e embalagem segura. O equipamento chegou pronto para uso. Recomendo fortemente!",
    author: "Ana Beatriz",
    role: "Designer Freelancer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    rating: 5
  },
  {
    id: 3,
    content: "O melhor custo-benefício que encontrei no mercado. A garantia estendida me deu a segurança que eu precisava.",
    author: "Carlos Eduardo",
    role: "Gerente de Compras",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    rating: 4
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-neutral-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">O que dizem nossos clientes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A confiança de quem já transformou seu negócio com nossas soluções.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-neutral-800 p-8 rounded-2xl hover:bg-neutral-750 transition-colors">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{item.content}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.author} 
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <h4 className="font-bold text-white">{item.author}</h4>
                  <p className="text-xs text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
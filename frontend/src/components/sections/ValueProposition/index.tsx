import { 
  ShieldCheckIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Compra Segura',
    description: 'Seus dados protegidos com criptografia de ponta a ponta.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Entrega Expressa',
    description: 'Logística otimizada para você receber seu produto em tempo recorde.',
    icon: TruckIcon,
  },
  {
    name: 'Melhor Custo-Benefício',
    description: 'Preços competitivos com garantia de qualidade superior.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Suporte Dedicado',
    description: 'Equipe pronta para atender você 24 horas por dia, 7 dias por semana.',
    icon: ChatBubbleLeftRightIcon,
  },
];

export const ValueProposition = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10 group"
            >
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary group-hover:text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
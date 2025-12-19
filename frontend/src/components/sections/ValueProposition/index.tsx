import { 
  CodeBracketIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Desenvolvimento Ágil',
    description: 'Entregas rápidas com código limpo e escalável.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Suporte Especializado',
    description: 'Equipe técnica pronta para atender sua empresa.',
    icon: CodeBracketIcon, // Ou ChatBubbleLeftRightIcon
  },
  {
    name: 'Segurança de Dados',
    description: 'Sistemas blindados e adequados à LGPD.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Alta Disponibilidade',
    description: 'Seu sistema online 24 horas por dia, 7 dias por semana.',
    icon: ClockIcon,
  },
];

export const ValueProposition = () => {
  return (
    <div className="bg-neutral-900 py-16 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center p-4 hover:bg-white/5 rounded-2xl transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary mb-4">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
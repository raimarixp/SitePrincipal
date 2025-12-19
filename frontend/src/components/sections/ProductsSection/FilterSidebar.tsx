import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers'; // Certifique-se que o helper existe ou remova o cn

interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  className?: string;
  idPrefix?: string; // Para evitar conflito de IDs entre mobile/desktop
}

const categories = [
  { name: 'Todos os serviços', id: null },
  { name: 'Sites Institucionais', id: 'Sites' },
  { name: 'Sistemas de Gestão', id: 'Sistemas' }, 
  { name: 'Aplicativos Mobile', id: 'Apps' },
  { name: 'Consultoria', id: 'Consultoria' },
];

export const FilterSidebar = ({ 
  selectedCategory, 
  onSelectCategory, 
  className,
  idPrefix = 'filter' 
}: FilterSidebarProps) => {
  
  return (
    // MUDANÇA PRINCIPAL: Adicionado container com fundo escuro e vidro (Glassmorphism)
    <div className={`space-y-8 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl ${className}`}>
      
      {/* Seção Categorias */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
          Categorias
        </h3>
        <div className="space-y-3">
          {categories.map((category, idx) => (
            <div key={category.name} className="flex items-center">
              <input
                id={`${idPrefix}-category-${idx}`}
                name={`${idPrefix}-category`}
                type="radio"
                checked={selectedCategory === category.id}
                onChange={() => onSelectCategory(category.id)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary bg-white/10"
              />
              <label
                htmlFor={`${idPrefix}-category-${idx}`}
                className={`ml-3 text-sm font-medium cursor-pointer transition-colors ${
                  selectedCategory === category.id 
                    ? 'text-white font-bold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Preço (Exemplo Visual) */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
          Faixa de Preço
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="sr-only">Mínimo</label>
            <input
              type="number"
              placeholder="Mín"
              className="w-full rounded-lg border border-white/20 bg-white/5 p-2 text-white placeholder-gray-400 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="sr-only">Máximo</label>
            <input
              type="number"
              placeholder="Máx"
              className="w-full rounded-lg border border-white/20 bg-white/5 p-2 text-white placeholder-gray-400 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
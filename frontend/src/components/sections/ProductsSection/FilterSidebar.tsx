import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/helpers';

const filters = [
  {
    id: 'category',
    name: 'Categorias',
    options: [
      { value: 'Áudio', label: 'Áudio' },
      { value: 'Wearables', label: 'Wearables' },
      { value: 'Escritório', label: 'Escritório' },
      { value: 'Periféricos', label: 'Periféricos' },
    ],
  },
];

interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  className?: string;
  idPrefix?: string; // ✅ Nova prop para evitar conflito de IDs
}

export const FilterSidebar = ({ 
  selectedCategory, 
  onSelectCategory, 
  className,
  idPrefix = 'desktop' // Valor padrão
}: FilterSidebarProps) => {
  return (
    <form className={cn("hidden lg:block space-y-8", className)}>
      {filters.map((section) => (
        <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6" defaultOpen>
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button type="button" className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {/* Opção "Todos" */}
                  <div className="flex items-center">
                    <input
                      id={`${idPrefix}-filter-all`} // ID Único
                      name={`${idPrefix}-category`} // Name Agrupado
                      type="radio"
                      checked={selectedCategory === null}
                      onChange={() => onSelectCategory(null)}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`${idPrefix}-filter-all`} className="ml-3 text-sm text-gray-600">
                      Todos os produtos
                    </label>
                  </div>

                  {/* Opções Dinâmicas */}
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`${idPrefix}-filter-${section.id}-${optionIdx}`} // ID Único
                        name={`${idPrefix}-${section.id}`} // Name Agrupado
                        type="radio"
                        checked={selectedCategory === option.value}
                        onChange={() => onSelectCategory(option.value)}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`${idPrefix}-filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
      
      {/* Filtro de Preço com IDs e Names corrigidos */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="font-medium text-gray-900 mb-4">Faixa de Preço</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${idPrefix}-price-min`} className="sr-only">Preço Mínimo</label>
              <input 
                type="number" 
                id={`${idPrefix}-price-min`}
                name="minPrice"
                placeholder="Mín" 
                className="w-full border rounded p-2 text-sm" 
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-price-max`} className="sr-only">Preço Máximo</label>
              <input 
                type="number" 
                id={`${idPrefix}-price-max`}
                name="maxPrice"
                placeholder="Máx" 
                className="w-full border rounded p-2 text-sm" 
              />
            </div>
        </div>
      </div>
    </form>
  );
};
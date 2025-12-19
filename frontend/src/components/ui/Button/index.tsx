import type { ButtonHTMLAttributes } from 'react';
import { cn } from "../../../utils/helpers";
import { Spinner } from './Spinner'; 

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base: Arredondado completo (rounded-full) e fonte Bold
        "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Variantes de Cor
        variant === 'primary' && "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/30 hover:shadow-primary/50 border-transparent",
        variant === 'secondary' && "bg-secondary text-white hover:bg-secondary-hover shadow-md border-transparent",
        variant === 'outline' && "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent", // Outline preto forte
        variant === 'ghost' && "text-gray-700 hover:bg-gray-100 border-transparent",

        // Tamanhos
        size === 'sm' && "px-4 py-1.5 text-sm",
        size === 'md' && "px-6 py-3 text-sm",
        size === 'lg' && "px-8 py-4 text-base",
        
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Spinner className="w-5 h-5" /> : children}
    </button>
  );
};
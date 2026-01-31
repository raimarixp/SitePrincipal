import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "../../../utils/helpers";

// Componente Spinner Interno para não depender de import externo se falhar
const Spinner = ({ className }: { className?: string }) => (
  <svg 
    className={cn("animate-spin -ml-1 mr-3 h-5 w-5 text-white", className)} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  fullWidth?: boolean;
  isLoading?: boolean; // Adicionado para corrigir o erro
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  asLink = false,
  href = '/',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:translate-y-0";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary/50 border border-transparent",
    secondary: "bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary/50 border border-transparent",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/50 bg-transparent",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-none border border-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent", 
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const classes = cn(baseStyles, variants[variant], sizes[size], widthClass, className);

  if (asLink && href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};
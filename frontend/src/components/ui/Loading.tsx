import React from 'react';

interface LoadingProps {
  /** Se true, ocupa a tela inteira com backdrop escuro (ideal para Suspense/Auth) */
  fullScreen?: boolean;
  /** Texto opcional abaixo do spinner */
  text?: string;
  /** Tamanho do spinner (padrão: md) */
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  text, 
  size = 'md' 
}) => {
  
  // Define o tamanho do círculo baseado na prop
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Círculo animado */}
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-full 
          animate-spin 
          border-slate-200 
          border-t-primary-500 
          dark:border-slate-700 
          dark:border-t-blue-500
        `}
      />
      
      {/* Texto opcional com animação de pulso */}
      {text && (
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-4">
      {spinnerContent}
    </div>
  );
};
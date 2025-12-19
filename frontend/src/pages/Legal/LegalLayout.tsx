import type { ReactNode } from 'react';

interface LegalLayoutProps {
  title: string;
  lastUpdate: string;
  children: ReactNode;
}

export const LegalLayout = ({ title, lastUpdate, children }: LegalLayoutProps) => {
  return (
    <div className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8 font-medium uppercase tracking-wide">
            Última atualização: {lastUpdate}
          </p>
          
          {/* Estilização para texto corrido (Prose) */}
          <div className="prose prose-lg prose-red max-w-none text-gray-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
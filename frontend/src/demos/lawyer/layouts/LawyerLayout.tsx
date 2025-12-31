import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const LawyerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Definimos a fonte padrão como serifada apenas para este demo
    <div className="font-serif min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* === HEADER === */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-amber-600/30">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/demo/advogado" className="text-2xl font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="text-amber-500 text-3xl">⚖️</span>
            <span>Jus<span className="text-amber-500">Tech</span></span>
          </Link>

          {/* Nav Desktop (Simplificada para Demo) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans tracking-wide">
            <a href="#home" className="hover:text-amber-500 transition-colors">Início</a>
            <a href="#areas" className="hover:text-amber-500 transition-colors">Atuação</a>
            <a href="#sobre" className="hover:text-amber-500 transition-colors">Sobre</a>
            
            {/* Botão CTA no Header */}
            <a 
              href="#contato" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-sm font-bold transition-all uppercase text-xs tracking-wider"
            >
              Agendar Consulta
            </a>
          </nav>
        </div>
      </header>

      {/* === CONTEÚDO DA PÁGINA === */}
      <main className="flex-grow">
        {children}
      </main>

      {/* === FOOTER === */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
          
          {/* Coluna 1: Marca */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 uppercase">JusTech Jurídico</h3>
            <p className="text-sm leading-relaxed mb-4">
              Defendendo seus direitos com integridade, excelência e transparência desde 1998.
            </p>
            <p className="text-xs text-slate-500">OAB/SP 123.456</p>
          </div>

          {/* Coluna 2: Contato Rápido */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-amber-500" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-amber-500" />
                Av. Paulista, 1000 - SP
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links */}
          <div>
             <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Links Úteis</h4>
             <ul className="space-y-2 text-sm font-sans">
               <li><a href="#" className="hover:text-amber-500">Política de Privacidade</a></li>
               <li><a href="#" className="hover:text-amber-500">Termos de Uso</a></li>
             </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-900 mt-10 pt-6 text-center text-xs font-sans">
          © {new Date().getFullYear()} Desenvolvido por WeBuildbr Ltda. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};
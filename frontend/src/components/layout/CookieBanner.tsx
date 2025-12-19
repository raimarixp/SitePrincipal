import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se já existe o consentimento salvo
    const consent = localStorage.getItem('@Empresa:cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('@Empresa:cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] border-t border-white/10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <p className="text-sm md:text-base leading-relaxed text-gray-300">
            Utilizamos cookies para melhorar sua experiência e personalizar a oferta de conteúdos. 
            Ao continuar navegando, você concorda com nossa{' '}
            <Link to="/privacidade" className="text-primary font-bold hover:underline">
              Política de Privacidade
            </Link>.
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleAccept}
            className="bg-primary text-black font-bold hover:bg-red-600 border-none px-8"
          >
            Aceitar e Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
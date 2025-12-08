import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container mx-auto px-6 pb-8 pt-16 lg:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <span className="text-2xl font-bold text-white">EMPRESA.</span>
            <p className="text-sm leading-6 text-gray-300 max-w-sm">
              Soluções profissionais para impulsionar o seu negócio com tecnologia de ponta e design inovador.
            </p>
            <div className="flex space-x-6">
              {/* Adicione ícones sociais aqui se desejar */}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Soluções</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/produtos" className="text-sm leading-6 text-gray-300 hover:text-white">Produtos</Link></li>
                  <li><Link to="#" className="text-sm leading-6 text-gray-300 hover:text-white">Consultoria</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Suporte</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/contato" className="text-sm leading-6 text-gray-300 hover:text-white">Contato</Link></li>
                  <li><Link to="#" className="text-sm leading-6 text-gray-300 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Empresa</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/sobre" className="text-sm leading-6 text-gray-300 hover:text-white">Sobre nós</Link></li>
                  <li><Link to="#" className="text-sm leading-6 text-gray-300 hover:text-white">Carreiras</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="#" className="text-sm leading-6 text-gray-300 hover:text-white">Privacidade</Link></li>
                  <li><Link to="#" className="text-sm leading-6 text-gray-300 hover:text-white">Termos</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2025 Sua Empresa Ltda. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
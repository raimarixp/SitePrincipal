import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/helpers';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Hooks Globais
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-white py-4"
    )}>
      <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
        
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold tracking-tight text-primary">
            EMPRESA<span className="text-secondary">.</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors hover:text-primary",
                location.pathname === item.href ? "text-primary" : "text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-4">
          
          {/* Carrinho */}
          <Link to="/carrinho" className="relative p-2 text-gray-900 hover:text-primary transition-colors group">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-secondary text-[11px] font-bold text-white flex items-center justify-center shadow-sm group-hover:bg-secondary-hover transition-colors">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu (Logado vs Deslogado) */}
          {user ? (
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center gap-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span className="sr-only">Abrir menu de usuário</span>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block font-medium text-gray-700">
                  {user.displayName || 'Minha Conta'}
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/minha-conta" className={cn(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                        Meu Perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/meus-pedidos" className={cn(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                        Meus Pedidos
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={signOut}
                        className={cn(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-red-600')}
                      >
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline" className="gap-2">
                <UserCircleIcon className="h-5 w-5" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu (Simplificado) */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold text-primary">EMPRESA.</Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-900">Olá, {user.email}</p>
                    <Link to="/minha-conta" className="block text-sm text-gray-600">Meu Perfil</Link>
                    <button onClick={signOut} className="block text-sm text-red-600">Sair</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Entrar / Cadastrar</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};
import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/helpers';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

// Imports do Firebase para verificar Admin
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

// ✅ ATUALIZAÇÃO: Adicionado 'Portfólio' na navegação
const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Portfólio', href: '/portfolio' }, // Nova aba
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verifica se o usuário é Admin no Firestore
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar admin:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const CartIcon = () => (
    <Link to="/carrinho" className="group -m-2 flex items-center p-2">
      <div className="relative">
        <ShoppingBagIcon
          className={cn(
            "h-6 w-6 flex-shrink-0 transition-colors",
            "text-gray-900 group-hover:text-primary"
          )}
          aria-hidden="true"
        />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        )}
      </div>
      <span className="sr-only">itens no carrinho, ver sacola</span>
    </Link>
  );

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white"
    )}>
      <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-4" aria-label="Global">
        
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 text-2xl font-black tracking-tighter text-gray-900">
            WebCraftBr<span className="text-primary">.</span>
          </Link>
        </div>

        {/* ÍCONES MOBILE (Carrinho + Menu Hamburguer) */}
        <div className="flex lg:hidden items-center gap-4">
          <CartIcon />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* MENU DESKTOP CENTRAL */}
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

        {/* ÁREA DO USUÁRIO DESKTOP */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-6">
          
          {/* Link Admin (Só aparece se for admin) */}
          {isAdmin && (
            <Link to="/admin" className="group -m-2 flex items-center p-2" title="Painel Administrativo">
              <Cog6ToothIcon 
                className="h-6 w-6 flex-shrink-0 transition-colors text-gray-900 group-hover:text-primary" 
                aria-hidden="true"
              />
            </Link>
          )}

          <CartIcon />
          
          <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5 focus:outline-none">
                <span className="sr-only">Abrir menu de usuário</span>
                {user.photoURL ? (
                  <img className="h-8 w-8 rounded-full bg-gray-50 object-cover" src={user.photoURL} alt="" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-2 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {user.displayName?.split(' ')[0] || 'Minha Conta'}
                  </span>
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
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/minha-conta" className={cn(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                        Meu Perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/meus-pedidos" className={cn(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                        Meus Pedidos
                      </Link>
                    )}
                  </Menu.Item>
                  
                  {isAdmin && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin" className={cn(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900 font-bold text-primary')}>
                          Painel Admin
                        </Link>
                      )}
                    </Menu.Item>
                  )}

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={cn(active ? 'bg-gray-50' : '', 'block w-full text-left px-3 py-1 text-sm leading-6 text-red-600')}
                      >
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary">
              Entrar <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {/* MENU MOBILE (Slide-over) */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 text-2xl font-black text-gray-900">
              WebCraftBr<span className="text-primary">.</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* Links de Navegação Mobile */}
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
                  <>
                    <div className="flex items-center gap-3 mb-4 px-3">
                      {user.photoURL ? (
                        <img className="h-10 w-10 rounded-full bg-gray-50 object-cover" src={user.photoURL} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{user.displayName || user.email}</p>
                        <p className="text-xs text-gray-500">Logado</p>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        🔧 Painel Admin
                      </Link>
                    )}

                    <Link
                      to="/meus-pedidos"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📦 Meus Pedidos
                    </Link>
                    <Link
                      to="/minha-conta"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ⚙️ Configurações
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-600 hover:bg-gray-50"
                    >
                      Sair da conta
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full justify-center">Entrar / Cadastrar</Button>
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
import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  const auth = useAuth();
  const user = auth?.user ?? null;

  const logout = async () => {
    if (!auth) return;
    try {
      if (typeof (auth as any).logout === 'function') {
        await (auth as any).logout();
      } else if (typeof (auth as any).signOut === 'function') {
        await (auth as any).signOut();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        }
      } catch (error) {
        console.error("Erro verificação admin", error);
      }
    };
    checkAdminStatus();
  }, [user]);

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b",
      scrolled 
        ? "bg-black/90 backdrop-blur-md border-tertiary/20 shadow-md shadow-primary/5" 
        : "bg-transparent border-transparent"
    )}>
      <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-4" aria-label="Global">
        
        {/* LOGO (Desktop) */}
        <div className="flex lg:flex-1">
<Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
  {/* Ícone SVG Pequeno */}

  {/* logotipo do header*/}
  <img 
    src="https://res.cloudinary.com/ddqrpidxw/image/upload/v1776188288/log_branco_sem_fundo_jem0cr.png"
    alt="Webuild Logo" 
    className="h-7 w-auto object-contain"
    />
  
  <span className="text-2xl font-black italic tracking-tighter text-white">
  WE<span className="text-primary">BUILD</span>
</span>
</Link>
        </div>

        {/* ÍCONES MOBILE */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-link",
                location.pathname === item.href ? "text-primary font-bold" : ""
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* ÁREA DO USUÁRIO */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-6">
          
          {isAdmin && (
            <Link to="/admin" className="group -m-2 flex items-center p-2" title="Painel Administrativo">
              <Cog6ToothIcon className="h-6 w-6 text-tertiary group-hover:text-primary transition-colors duration-300" />
            </Link>
          )}

          <div className="h-6 w-px bg-tertiary/30" aria-hidden="true" />

          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5 focus:outline-none group">
                {user.photoURL ? (
                  <img className="h-8 w-8 rounded-full bg-tertiary object-cover border-2 border-transparent group-hover:border-primary transition-all" src={user.photoURL} alt="" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/50 group-hover:bg-primary group-hover:text-white transition-all">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-2 text-sm font-semibold leading-6 text-white uppercase tracking-wider group-hover:text-primary transition-colors">
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
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-[#111111] py-2 shadow-xl shadow-primary/10 ring-1 ring-tertiary/20 focus:outline-none border border-tertiary/10">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/meus-pedidos" className={cn(active ? 'bg-primary/10 text-primary' : 'text-tertiary', 'block px-3 py-1 text-sm leading-6 transition-colors')}>
                        Acompanhar Serviços
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={() => logout()} className={cn(active ? 'bg-red-900/20' : '', 'block w-full text-left px-3 py-1 text-sm leading-6 text-red-500 hover:text-red-400')}>
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login" className="btn-primary-new text-sm">
              Área do Cliente
            </Link>
          )}
        </div>
      </nav>

      {/* MENU MOBILE */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#000000] px-6 py-6 sm:max-w-sm border-l border-tertiary/20">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
               {/* AQUI ESTÁ A MUDANÇA NO MOBILE: Web em azul, o resto em branco */}
               <span className="text-2xl font-black italic tracking-tighter text-white">
  WE<span className="text-primary">BUILD</span>
</span>
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-white hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Fechar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-tertiary/20">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-white/5 uppercase transition-colors",
                      location.pathname === item.href ? "text-primary" : "text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                   <>
                    <Link to="/meus-pedidos" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-primary hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                       📂 Acompanhar Serviços
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-500 hover:bg-white/5">
                      Sair da conta
                    </button>
                   </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:text-primary border border-tertiary/30 text-center mt-4">
                    Entrar / Área do Cliente
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
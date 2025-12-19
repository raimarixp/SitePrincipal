import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Imports dos Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Imports de Componentes e Páginas
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LiquidGradient } from './components/ui/LiquidGradient';
import { CookieBanner } from './components/layout/CookieBanner'; // Componente LGPD

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Login } from './pages/Auth/Login'; 
import { Profile } from './pages/Profile';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { AdminRoute } from './components/auth/AdminRoute';
import { Dashboard } from './pages/Admin/Dashboard';

// Imports das Páginas Legais
import { Privacy } from './pages/Legal/Privacy';
import { Terms } from './pages/Legal/Terms';

// Layout Wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* 1. Gradiente fixo no fundo */}
    <LiquidGradient />
    
    {/* 2. Banner de Cookies (LGPD) */}
    <CookieBanner />
    
    {/* 3. Container Principal
       CORREÇÃO DE RESPONSIVIDADE:
       - w-full: Garante largura total
       - overflow-x-hidden: Corta qualquer elemento que tente ultrapassar a largura da tela (resolve o scroll lateral no mobile)
    */}
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />
              
              {/* Produtos */}
              <Route path="/produtos" element={<Products />} />
              <Route path="/produtos/:id" element={<ProductDetails />} />
              
              {/* Autenticação e Perfil */}
              <Route path="/login" element={<Login />} />
              <Route path="/minha-conta" element={<Profile />} />

              {/* Checkout e Pedidos */}
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/meus-pedidos" element={<Orders />} />
              <Route path="/sucesso" element={<Success />} />
              <Route path="/falha" element={<Failure />} />
              <Route path="/pendente" element={<Failure />} />
              
              {/* Institucionais */}
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />

              {/* Páginas Legais (LGPD) */}
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
              <Route 
  path="/admin" 
  element={
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  } 
/>
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
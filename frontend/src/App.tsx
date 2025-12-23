import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Imports dos Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Imports de Componentes de Layout e UI
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LiquidGradient } from './components/ui/LiquidGradient';
import { CookieBanner } from './components/layout/CookieBanner';

// Imports de Páginas Públicas
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Imports de Auth e Usuário
import { Login } from './pages/Auth/Login'; 
import { Profile } from './pages/Profile';

// Imports de Checkout e Pedidos
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';

// Imports Administrativos
import { AdminRoute } from './components/auth/AdminRoute';
import { Dashboard } from './pages/Admin/Dashboard'; // O Painel com gráficos
import { Admin as AdminProducts } from './pages/Admin/Products'; // A Tabela de edição (✅ Import Novo)

// Imports das Páginas Legais
import { Privacy } from './pages/Legal/Privacy';
import { Terms } from './pages/Legal/Terms';

// Layout Wrapper (Mantém o gradiente e estrutura)
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* 1. Gradiente fixo no fundo */}
    <LiquidGradient />
    
    {/* 2. Banner de Cookies (LGPD) */}
    <CookieBanner />
    
    {/* 3. Container Principal */}
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
              {/* === ROTAS PÚBLICAS === */}
              <Route path="/" element={<Home />} />
              
              {/* Produtos e Serviços */}
              <Route path="/produtos" element={<Products />} />
              <Route path="/produtos/:id" element={<ProductDetails />} />
              <Route path="/portfolio" element={<Portfolio />} />
              
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

              {/* === ROTAS ADMINISTRATIVAS (Protegidas) === */}
              
              {/* 1. Dashboard (Visão Geral) */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                } 
              />

              {/* 2. Gerenciamento de Produtos (Tabela de Edição) */}
              <Route 
                path="/admin/produtos" 
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } 
              />

              {/* Rota 404 - Fallback */}
              <Route path="*" element={
                <div className="min-h-screen pt-32 flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p>Página não encontrada</p>
                  </div>
                </div>
              } />

            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
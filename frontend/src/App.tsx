import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Imports dos Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Imports de Componentes de Layout e UI (DA AGÊNCIA)
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LiquidGradient } from './components/ui/LiquidGradient';
import { CookieBanner } from './components/layout/CookieBanner';
import { Loading } from './components/ui/Loading';
import { Toaster } from 'react-hot-toast';

// Imports de Páginas Públicas
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Portfolio } from './pages/Portfolio'; // Essa é a página que lista os demos
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Imports de Auth e Usuário
import { Login } from './pages/Auth/Login'; 
import { Profile } from './pages/Profile';

// Imports de Checkout e Pedidos
import { Checkout } from './pages/Checkout';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { AdminOrders } from './pages/Admin/Orders';

// Imports Administrativos
import { AdminRoute } from './components/auth/AdminRoute';
import { Dashboard } from './pages/Admin/Dashboard';
import { Admin as AdminProducts } from './pages/Admin/Products';

// Imports das Páginas Legais
import { Privacy } from './pages/Legal/Privacy';
import { Terms } from './pages/Legal/Terms';
import { DemoViewer } from './pages/DemoViewer';

// === IMPORTAÇÃO DOS DEMOS (PORTFÓLIO) ===
// Usamos Lazy Load para não pesar o site principal
const LawyerApp = lazy(() => import('./demos/lawyer/App')); // Entry point do Advogado
const FoodMenuApp = lazy(() => import('./demos/food-menu/App')); // Entry point do Cardápio

// === LAYOUT WRAPPER DA AGÊNCIA ===
// Este layout só envolve as páginas da SUA empresa.
// Os demos terão seus próprios layouts internos.
const AgencyLayout = () => (
  <>
    {/* 1. Gradiente fixo no fundo (Estilo Agência) */}
    <LiquidGradient />
    
    {/* 2. Banner de Cookies */}
    <CookieBanner />
    
    {/* 3. Container Principal */}
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden relative z-10">
      <Header />
      
      <main className="flex-grow">
        {/* Renderiza a página filha da rota atual */}
        <Outlet />
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
        <Toaster position="top-center" reverseOrder={false} />
          <Suspense fallback={
            <Loading fullScreen text="Carregando Portfólio..." />
          }>
            <Routes>
              
              {/* === 1. ROTAS DOS DEMOS (PORTFÓLIO) === */}
              {/* Elas ficam FORA do AgencyLayout para terem design 100% exclusivo */}
              
              {/* Site Advogado: seusite.com/demo/advogado */}
              <Route path="/demo/advogado/*" element={<LawyerApp />} />

              {/* Site Cardápio: seusite.com/demo/cardapio */}
              <Route path="/demo/cardapio/*" element={<FoodMenuApp />} />

              <Route path="/visualizar/:id" element={<DemoViewer />} />

              {/* === 2. ROTAS DA AGÊNCIA (SEU SITE) === */}
              {/* Todas estas rotas herdam o Header, Footer e Gradiente da Agência */}
              <Route element={<AgencyLayout />}>
                
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produtos/:id" element={<ProductDetails />} />
                <Route path="/portfolio" element={<Portfolio />} /> {/* Lista os demos */}
                
                {/* Institucionais */}
                <Route path="/sobre" element={<About />} />
                <Route path="/contato" element={<Contact />} />

                {/* Autenticação e Perfil */}
                <Route path="/login" element={<Login />} />
                <Route path="/minha-conta" element={<Profile />} />

                {/* Checkout e Pedidos */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/meus-pedidos" element={<Orders />} />
                <Route path="/sucesso" element={<Success />} />
                <Route path="/falha" element={<Failure />} />
                <Route path="/pendente" element={<Failure />} />
                
                {/* Páginas Legais */}
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />

                {/* === ÁREA ADMINISTRATIVA === */}
                <Route path="/admin" element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } 
                />

                <Route path="/admin/pedidos" element={<AdminOrders />} />
                
                <Route path="/admin/produtos" element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } 
                />

                <Route path="/admin/pedidos" element={
  <AdminRoute>
    <AdminOrders />
  </AdminRoute>
} />

                {/* Rota 404 (Dentro do Layout da Agência) */}
                <Route path="*" element={
                  <div className="min-h-screen pt-32 flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p>Página não encontrada</p>
                    </div>
                  </div>
                } />
                
              </Route> {/* Fim do AgencyLayout */}

            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 
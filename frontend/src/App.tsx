import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Imports dos Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Imports de Componentes e Páginas
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Login } from './pages/Auth/Login'; // Vamos criar essa página já já
import { Profile } from './pages/Profile'; // Vamos criar essa página já já
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';

// Layout Wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    // 1. AuthProvider envolve tudo (usuário global)
    <AuthProvider>
      {/* 2. CartProvider vem dentro (carrinho precisa do user as vezes) */}
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/produtos/:id" element={<ProductDetails />} />
              
              {/* Rotas de Autenticação e Perfil */}
              <Route path="/login" element={<Login />} />
              <Route path="/minha-conta" element={<Profile />} />

              {/* Rotas de Checkout */}
              <Route path="/sucesso" element={<Success />} />
              <Route path="/falha" element={<Failure />} />
              <Route path="/pendente" element={<Failure />} />
              
              <Route path="/sobre" element={<div className="pt-20 text-center">Sobre Nós</div>} />
              <Route path="/contato" element={<div className="pt-20 text-center">Contato</div>} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
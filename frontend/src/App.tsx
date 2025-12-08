import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';

// Layout Wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-20"> {/* pt-20 compensa o Header fixo */}
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:id" element={<ProductDetails />} />
          <Route path="/sobre" element={<div className="pt-20 text-center">Página Sobre (Em construção)</div>} />
          <Route path="/contato" element={<div className="pt-20 text-center">Página Contato (Em construção)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
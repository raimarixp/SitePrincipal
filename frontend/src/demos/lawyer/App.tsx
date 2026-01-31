// empresa-site/frontend/src/demos/lawyer/App.tsx
import { Routes, Route } from 'react-router-dom';
import { LawyerLayout } from './layouts/LawyerLayout';
import { Home } from './pages/Home';

const LawyerApp = () => {
  return (
    <LawyerLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Outras rotas internas do advogado aqui */}
      </Routes>
    </LawyerLayout>
  );
};

export default LawyerApp;
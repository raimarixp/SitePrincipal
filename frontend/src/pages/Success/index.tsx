import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';

export const Success = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Obrigado pela sua compra. Recebemos seu pedido e já estamos processando o envio.
          Você receberá os detalhes por e-mail em breve.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/produtos">
            <Button size="lg" className="w-full sm:w-auto">
              Continuar Comprando
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
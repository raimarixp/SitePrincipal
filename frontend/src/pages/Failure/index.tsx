import { Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';

export const Failure = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-8">
          <XCircleIcon className="h-16 w-16 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ops! Algo deu errado.</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Não conseguimos processar seu pagamento. Isso pode acontecer por falta de limite, bloqueio do banco ou dados incorretos.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/produtos">
            <Button size="lg">
              Tentar Novamente
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
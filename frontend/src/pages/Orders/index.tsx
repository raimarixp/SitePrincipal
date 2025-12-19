import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

// Definição do Tipo de Pedido
interface Order {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: any;
  items: Array<{
    title: string;
    quantity: number;
    picture_url: string;
  }>;
}

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Busca pedidos do usuário logado
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc') // Ordena do mais recente para o antigo
        );

        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(ordersList);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        // Dica: Se der erro de índice, o console vai mostrar um link para criar o índice.
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Função para traduzir status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago / Aprovado';
      case 'approved': return 'Pago / Aprovado';
      case 'pending': return 'Pendente';
      default: return 'Cancelado';
    }
  };

  if (loading) return <div className="pt-32 text-center">Carregando seus pedidos...</div>;

  if (orders.length === 0) {
    return (
      <div className="pt-32 pb-12 text-center container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Você ainda não tem pedidos</h2>
        <Link to="/produtos"><Button>Ir às compras</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Meus Pedidos</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cabeçalho do Pedido */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Data do Pedido</p>
                  <p className="text-sm text-gray-900">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data recente'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(order.amount)}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="p-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.picture_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
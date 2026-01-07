import { useState, useEffect, type ReactNode } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { formatPrice } from '../../../utils/helpers';
import { OrderDetails } from './OrderDetails'; // Vamos criar este arquivo abaixo
import { 
  EyeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TruckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Interface baseada no que salvamos no Checkout
export interface Order {
  id: string;
  createdAt: any;
  status: 'pending' | 'approved' | 'paid' | 'shipped' | 'cancelled';
  total: number;
  items: any[];
  payer?: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  deliveryAddress?: {
    name: ReactNode;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
}

// Componente Badge de Status
export const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  const labels: any = {
    pending: 'Pendente',
    approved: 'Aprovado',
    paid: 'Pago',
    shipped: 'Enviado',
    cancelled: 'Cancelado',
  };

  const icons: any = {
    pending: <ClockIcon className="w-3 h-3" />,
    approved: <CheckCircleIcon className="w-3 h-3" />,
    paid: <CheckCircleIcon className="w-3 h-3" />,
    shipped: <TruckIcon className="w-3 h-3" />,
    cancelled: <XCircleIcon className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
      {icons[status]}
      {labels[status] || status}
    </span>
  );
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Escuta em tempo real
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Formata data com segurança
  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return '-';
    return timestamp.toDate().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pt-32 min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos Recebidos</h1>
          <p className="text-gray-500 text-sm">Gerencie vendas e status de entrega</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium">
          Total: <span className="text-primary font-bold">{orders.length} pedidos</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4 border-b border-gray-200">Data / ID</th>
                  <th className="p-4 border-b border-gray-200">Cliente</th>
                  <th className="p-4 border-b border-gray-200">Total</th>
                  <th className="p-4 border-b border-gray-200">Status</th>
                  <th className="p-4 border-b border-gray-200 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    
                    {/* Data e ID */}
                    <td className="p-4 align-top">
                      <div className="font-medium text-gray-900">{formatDate(order.createdAt)}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1">#{order.id.slice(0, 8)}</div>
                    </td>

                    {/* Cliente (Dados corrigidos do 'payer') */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-900">
                        {order.payer?.name || 'Cliente'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.payer?.email}</div>
                      {order.deliveryAddress && (
                        <div className="text-xs text-gray-400 mt-1">
                          {order.deliveryAddress.city} - {order.deliveryAddress.state}
                        </div>
                      )}
                    </td>

                    {/* Total */}
                    <td className="p-4 align-top font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </td>

                    {/* Status */}
                    <td className="p-4 align-top">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Botão Detalhes */}
                    <td className="p-4 align-top text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                      >
                        <EyeIcon className="w-4 h-4" /> Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes (Componente separado abaixo) */}
      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};
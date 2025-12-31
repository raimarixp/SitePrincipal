import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { formatPrice } from '../../../utils/helpers';
import { OrderDetails } from './OrderDetails';
import { 
  EyeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

// Badge de Status Colorido
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  const labels = {
    pending: 'Pendente',
    approved: 'Aprovado',
    paid: 'Pago',
    shipped: 'Concluído',
    cancelled: 'Cancelado',
  };

  const icons = {
    pending: <ClockIcon className="w-4 h-4" />,
    approved: <CheckCircleIcon className="w-4 h-4" />,
    paid: <CheckCircleIcon className="w-4 h-4" />,
    shipped: <TruckIcon className="w-4 h-4" />,
    cancelled: <XCircleIcon className="w-4 h-4" />,
  };

  const s = status as keyof typeof styles;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[s] || styles.pending}`}>
      {icons[s] || icons.pending}
      {labels[s] || status}
    </span>
  );
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Escuta Tempo Real do Firestore
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pedidos Recebidos</h1>
          <p className="text-slate-500">Gerencie as vendas e instalações</p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow text-sm font-medium">
          Total: <span className="text-blue-600 font-bold">{orders.length} pedidos</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhum pedido recebido ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 border-b dark:border-slate-700">Data</th>
                  <th className="p-4 border-b dark:border-slate-700">Cliente</th>
                  <th className="p-4 border-b dark:border-slate-700">Total</th>
                  <th className="p-4 border-b dark:border-slate-700">Status</th>
                  <th className="p-4 border-b dark:border-slate-700 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {order.createdAt?.toDate().toLocaleDateString('pt-BR')} <br/>
                      <span className="text-xs text-slate-400">
                        {order.createdAt?.toDate().toLocaleTimeString('pt-BR').slice(0,5)}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {order.customer?.fullName || 'Cliente Desconhecido'}
                      <div className="text-xs text-slate-500 font-normal">{order.customer?.city} - {order.customer?.state}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-1 ml-auto font-medium text-xs uppercase"
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

      {/* MODAL DE DETALHES */}
      <OrderDetails 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};
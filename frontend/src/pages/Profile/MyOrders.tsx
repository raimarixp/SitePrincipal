import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { 
  ShoppingBagIcon, 
  ChevronRightIcon, 
  UserIcon, 
  MapPinIcon,
  TruckIcon,
  CalendarIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// === INTERFACES (Tipagem) ===
interface OrderItem {
  id: string;
  title?: string;
  name?: string; // Fallback para title
  quantity: number;
  price: number;
  unit_price?: number; // Fallback para price
  image?: string;
  images?: string[]; // Fallback para image
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  cep?: string; // Fallback para zipCode
}

interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  status: 'pending' | 'approved' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  
  // Dados do Cliente (Suporte a estruturas novas e antigas)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  payer?: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };

  // Endereço (Suporte a estruturas novas e antigas)
  shippingAddress?: Address;
  deliveryAddress?: Address;

  // Rastreio e Datas
  createdAt: any;
  trackingCode?: string;
  estimatedDelivery?: string;
}

// === COMPONENTES AUXILIARES ===

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  };

  const labels: Record<string, string> = {
    pending: 'Aguardando Pagamento',
    approved: 'Aprovado',
    paid: 'Pago',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
};

// Componente de Detalhes (Expandido)
const OrderDetails = ({ order, isExpanded }: { order: Order; isExpanded: boolean }) => {
  if (!isExpanded) return null;

  // Normalização de dados para evitar erros (Fallback entre estruturas antigas e novas)
  const address = order.deliveryAddress || order.shippingAddress;
  const customer = order.payer || {
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    cpf: '-'
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in bg-gray-50/50 -mx-6 px-6 pb-6 rounded-b-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUNA 1: Dados e Endereço */}
        <div className="space-y-6">
          
          {/* Dados do Cliente */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4" /> Dados do Cliente
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-1 shadow-sm">
              <p><span className="text-gray-500">Nome:</span> <span className="font-medium text-gray-900">{customer.name || 'N/D'}</span></p>
              <p><span className="text-gray-500">Email:</span> {customer.email || 'N/D'}</p>
              <p><span className="text-gray-500">CPF:</span> {customer.cpf || 'N/D'}</p>
              <p><span className="text-gray-500">Tel:</span> {customer.phone || 'N/D'}</p>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 mb-3">
              <MapPinIcon className="w-4 h-4" /> Endereço de Entrega
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm shadow-sm">
              {address ? (
                <>
                  <p className="font-bold text-gray-900">{address.street}, {address.number}</p>
                  {address.complement && <p className="text-gray-600">{address.complement}</p>}
                  <p className="text-gray-600">{address.neighborhood}</p>
                  <p className="text-gray-600">{address.city} - {address.state}</p>
                  <p className="text-xs text-gray-400 mt-2">CEP: {address.zipCode || address.cep}</p>
                </>
              ) : (
                <p className="text-gray-400 italic">Endereço não informado ou produto digital.</p>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA 2: Itens e Pagamento */}
        <div className="space-y-6">
          
          {/* Lista de Itens */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 mb-3">
              <ShoppingBagIcon className="w-4 h-4" /> Itens Comprados
            </h4>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {order.items.map((item, idx) => {
                const title = item.title || item.name || 'Produto sem nome';
                const price = item.price || item.unit_price || 0;
                const img = item.image || (item.images && item.images[0]) || null;

                return (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {img ? (
                        <img src={img} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBagIcon className="w-6 h-6 m-3 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{title}</p>
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(price * item.quantity)}</p>
                  </div>
                );
              })}
              <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase">Total do Pedido</span>
                <span className="text-base font-black text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Rastreio e Infos Extras */}
          {(order.trackingCode || order.estimatedDelivery) && (
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 mb-3">
                <TruckIcon className="w-4 h-4" /> Rastreio
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                {order.trackingCode && (
                  <p className="mb-1"><span className="font-bold text-blue-900">Código:</span> {order.trackingCode}</p>
                )}
                {order.estimatedDelivery && (
                  <p><span className="font-bold text-blue-900">Previsão:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL ===

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;

    // Busca pedidos em tempo real
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Order[];
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, db]);

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBagIcon className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Nenhum pedido encontrado</h3>
        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Você ainda não realizou nenhuma compra. Visite nossa loja para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className={`bg-white border transition-all rounded-xl overflow-hidden ${
            expandedOrderId === order.id ? 'border-primary ring-1 ring-primary shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'
          }`}
        >
          {/* Cabeçalho do Card (Sempre Visível) */}
          <div className="p-6 cursor-pointer" onClick={() => toggleDetails(order.id)}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-lg hidden sm:block">
                  <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data n/d'}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{formatPrice(order.total)}</h4>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <StatusBadge status={order.status} />
                
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  {expandedOrderId === order.id ? 'Ocultar' : 'Detalhes'}
                  {expandedOrderId === order.id ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Componente de Detalhes (Renderização Condicional) */}
          <OrderDetails order={order} isExpanded={expandedOrderId === order.id} />
        </div>
      ))}
    </div>
  );
};
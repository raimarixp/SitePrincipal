import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MapPinIcon, UserIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../../utils/helpers';
import { type Order, StatusBadge } from './index';

interface OrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetails = ({ order, isOpen, onClose }: OrderDetailsProps) => {
  const [updating, setUpdating] = useState(false);
  const db = getFirestore();

  if (!order) return null;

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Confirmar alteração para: ${newStatus}?`)) return;
    setUpdating(true);
    const toastId = toast.loading("Sincronizando...");
    try {
      // Isso atualiza o Firestore. Como o cliente escuta o Firestore,
      // a atualização é AUTOMÁTICA no painel dele também.
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
      toast.success("Status atualizado!", { id: toastId });
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
          
          {/* Header com Gradiente */}
          <div className="px-6 py-6 bg-gradient-to-r from-slate-800 to-slate-900 flex justify-between items-start text-white">
            <div>
              <Dialog.Title className="text-xl font-bold flex items-center gap-2">
                Pedido #{order.id.slice(0, 8).toUpperCase()}
              </Dialog.Title>
              <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                <CalendarIcon className="w-4 h-4" />
                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('pt-BR') : 'Data inválida'}
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
            
            {/* Status Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Status Atual</span>
                <StatusBadge status={order.status} />
              </div>
              
              {/* Botões de Ação */}
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => handleStatusChange('paid')}
                    disabled={updating}
                    className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50"
                  >
                    Marcar Pago Manual
                  </button>
                )}
                {order.status === 'paid' && (
                  <button 
                    onClick={() => handleStatusChange('shipped')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50"
                  >
                    Marcar Enviado
                  </button>
                )}
                 {order.status !== 'cancelled' && order.status !== 'shipped' && (
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={updating}
                    className="px-4 py-2 bg-white text-primary border border-primary text-xs font-bold rounded-lg hover:bg-primary disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados do Cliente */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-4 border-b pb-2">
                  <UserIcon className="h-4 w-4" /> Dados do Cliente
                </h3>
                {order.payer ? (
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Nome:</span> <span className="font-semibold text-slate-800">{order.payer.name}</span></p>
                    <p><span className="text-slate-500">Email:</span> <span className="text-slate-800">{order.payer.email}</span></p>
                    <p><span className="text-slate-500">CPF:</span> <span className="font-mono text-slate-800">{order.payer.cpf}</span></p>
                    <p><span className="text-slate-500">Tel:</span> <span className="font-mono text-slate-800">{order.payer.phone}</span></p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                    Dados do pagador não salvos neste pedido (Pedido Antigo).
                  </div>
                )}
              </div>

              {/* Endereço */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-4 border-b pb-2">
                  <MapPinIcon className="h-4 w-4" /> Entrega
                </h3>
                {order.deliveryAddress ? (
                   <div className="text-sm text-slate-600">
                      <p className="font-bold text-slate-800">{order.deliveryAddress.street}, {order.deliveryAddress.number}</p>
                      <p>{order.deliveryAddress.neighborhood}</p>
                      <p>{order.deliveryAddress.city} - {order.deliveryAddress.state}</p>
                      <p className="mt-2 font-mono text-xs bg-slate-100 inline-block px-2 py-1 rounded">{order.deliveryAddress.cep}</p>
                   </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                    Sem endereço (Produto Digital ou Erro)
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase">Itens do Pedido</h3>
              </div>
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">{item.title || item.name}</div>
                        <div className="text-xs text-slate-500">Qtd: {item.quantity}</div>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-900">
                        {formatPrice((item.unit_price || item.price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200">
                  <tr>
                    <td className="px-5 py-4 text-right font-bold text-slate-600 uppercase text-xs">Total Geral</td>
                    <td className="px-5 py-4 text-right font-black text-xl text-primary">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
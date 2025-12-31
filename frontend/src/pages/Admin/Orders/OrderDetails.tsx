import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MapPinIcon, UserIcon, PhoneIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '../../../utils/helpers';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { Button } from '../../../components/ui/Button';

interface OrderDetailsProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const { customer, items } = order;

  // Função para mudar status manualmente (ex: se o cliente pagou via Pix manual)
  const updateStatus = async (newStatus: string) => {
    if (confirm(`Deseja alterar o status para: ${newStatus}?`)) {
      try {
        await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
        onClose(); // Fecha para atualizar a lista
      } catch (error) {
        alert("Erro ao atualizar status");
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Cabeçalho */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                Pedido #{order.id.slice(0, 8).toUpperCase()}
              </Dialog.Title>
              <p className="text-sm text-slate-500">
                Realizado em: {order.createdAt?.toDate().toLocaleString('pt-BR')}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. DADOS DO CLIENTE */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Cliente
                </h3>
                <div className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
                  <p><span className="font-bold">Nome:</span> {customer.fullName}</p>
                  <p><span className="font-bold">CPF/CNPJ:</span> {customer.document}</p>
                  <p><span className="font-bold">Email:</span> {customer.email}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold">Tel:</span> 
                    {customer.phone}
                    <a 
                      href={`https://wa.me/55${customer.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      className="text-green-600 text-xs font-bold hover:underline"
                    >
                      (Abrir WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" /> Endereço de Instalação
                </h3>
                <div className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
                  <p>{customer.street}, {customer.number}</p>
                  <p>{customer.neighborhood}</p>
                  {customer.complement && <p className="text-slate-500">Comp: {customer.complement}</p>}
                  <p>{customer.city} - {customer.state}</p>
                  <p className="font-mono text-xs mt-2">CEP: {customer.zipCode}</p>
                </div>
              </div>
            </div>

            {/* 2. PRODUTOS */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CreditCardIcon className="w-4 h-4" /> Itens do Pedido
              </h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-right">Qtd</th>
                      <th className="p-3 text-right">Preço</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {items.map((item: any, idx: number) => (
                      <tr key={idx} className="bg-white dark:bg-slate-800">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{formatPrice(item.price)}</td>
                        <td className="p-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-900 font-bold">
                    <tr>
                      <td colSpan={3} className="p-3 text-right">Total Geral</td>
                      <td className="p-3 text-right text-lg text-blue-600">{formatPrice(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>

          {/* Rodapé com Ações */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            {order.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => updateStatus('cancelled')} className="border-red-200 text-red-600 hover:bg-red-50">
                  Cancelar Pedido
                </Button>
                <Button onClick={() => updateStatus('approved')} className="bg-green-600 hover:bg-green-700 text-white">
                  Marcar como Pago
                </Button>
              </>
            )}
            {order.status === 'approved' && (
              <Button onClick={() => updateStatus('shipped')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Marcar como Enviado/Instalado
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>Fechar</Button>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
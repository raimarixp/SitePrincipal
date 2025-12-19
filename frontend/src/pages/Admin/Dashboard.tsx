import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Adicionei ícones

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  isConsultation?: boolean; // Novo campo
}

interface Order {
  id: string;
  total: number;
  status: string;
  userEmail: string;
  createdAt: any;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estado do Formulário
  const [editingId, setEditingId] = useState<string | null>(null); // Nulo = Criando, String = Editando
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    isConsultation: false // Novo checkbox
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Buscar Pedidos
    const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const ordersSnap = await getDocs(ordersQ);
    setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));

    // Buscar Produtos
    const productsSnap = await getDocs(collection(db, 'products'));
    setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
  };

  // Prepara o formulário para editar
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.images[0] || '',
      isConsultation: product.isConsultation || false
    });
    // Rola para o topo do formulário suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: '', image: '', isConsultation: false });
  };

  // Salvar (Criar ou Atualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      images: [formData.image],
      isConsultation: formData.isConsultation,
      description: 'Solução tecnológica completa.', // Pode adicionar campo de descrição depois
      stock: 99
    };

    try {
      if (editingId) {
        // MODO EDIÇÃO
        await updateDoc(doc(db, 'products', editingId), payload);
        alert('Produto atualizado com sucesso!');
      } else {
        // MODO CRIAÇÃO
        await addDoc(collection(db, 'products'), payload);
        alert('Produto criado com sucesso!');
      }
      
      handleCancelEdit(); // Limpa form
      fetchData(); // Recarrega lista
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchData();
    }
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

        {/* Abas */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
          <button onClick={() => setActiveTab('orders')} className={`pb-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Pedidos</button>
          <button onClick={() => setActiveTab('products')} className={`pb-2 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Produtos/Serviços</button>
        </div>

        {/* TAB PEDIDOS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
             {/* ... (Tabela de pedidos mantém igual) ... */}
             <div className="p-8 text-center text-gray-500">Seus pedidos aparecerão aqui.</div>
          </div>
        )}

        {/* TAB PRODUTOS */}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* FORMULÁRIO */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow sticky top-24 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Editar Serviço' : 'Novo Serviço'}
                  </h3>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="text-xs text-red-500 hover:underline">
                      Cancelar Edição
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                    <input 
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Criação de Site"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preço Base (R$)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select 
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="Sites">Sites Institucionais</option>
                      <option value="Sistemas">Sistemas de Gestão</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Apps">Aplicativos Mobile</option>
                      <option value="Consultoria">Consultoria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
                    <input 
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary" 
                      placeholder="https://..."
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                  </div>

                  {/* CHECKBOX ORÇAMENTO */}
                  <div className="flex items-center gap-2 py-2 bg-gray-50 px-2 rounded border border-gray-200">
                    <input 
                      type="checkbox" 
                      id="consultation"
                      checked={formData.isConsultation}
                      onChange={e => setFormData({...formData, isConsultation: e.target.checked})}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="consultation" className="text-sm text-gray-700 select-none cursor-pointer">
                      <strong>Requer Orçamento?</strong> (Botão vira "Consultar")
                    </label>
                  </div>

                  <Button type="submit" className="w-full font-bold">
                    {editingId ? 'Salvar Alterações' : 'Adicionar Serviço'}
                  </Button>
                </form>
              </div>
            </div>

            {/* LISTA DE PRODUTOS */}
            <div className="lg:col-span-2 space-y-4">
               {products.map(product => (
                 <div key={product.id} className={`bg-white p-4 rounded-xl shadow flex items-center justify-between border ${editingId === product.id ? 'border-primary ring-1 ring-primary' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                      <img src={product.images[0]} alt="" className="w-16 h-16 object-cover rounded-md bg-gray-100"/>
                      <div>
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatPrice(product.price)}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                          {product.isConsultation && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
                              Orçamento
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Botão EDITAR */}
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>

                      {/* Botão DELETAR */}
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Deletar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
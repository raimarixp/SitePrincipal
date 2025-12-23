import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { ProductModal } from './ProductModal'; // ✅ Importa o modal que você já tem
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '../../utils/helpers';

// 👇 AQUI ESTÁ A EXPORTAÇÃO QUE O ERRO ESTAVA RECLAMANDO
export const Admin = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar produtos do Firebase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Abrir modal para CRIAÇÃO
  const handleCreate = () => {
    setEditingProduct(null); // Null indica criação
    setIsModalOpen(true);
  };

  // Abrir modal para EDIÇÃO
  const handleEdit = (product: any) => {
    setEditingProduct(product); // Passa os dados para o modal preencher
    setIsModalOpen(true);
  };

  // Deletar Produto
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        alert('Item excluído com sucesso.');
        fetchProducts(); // Recarrega a lista
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao tentar excluir.");
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Catálogo</h1>
            <p className="text-gray-500">Adicione, edite ou remova produtos e serviços.</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Novo Item
          </Button>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto / Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      Carregando catálogo...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      Nenhum produto encontrado. Clique em "Novo Item" para começar.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {product.images?.[0] ? (
                              <img className="h-full w-full object-cover" src={product.images[0]} alt="" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Sem foto</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.demoUrl && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Portfólio
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.requiresQuote ? (
                          <span className="text-orange-600 font-bold text-xs uppercase bg-orange-100 px-2 py-1 rounded">
                            Sob Orçamento
                          </span>
                        ) : (
                          <span className="font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="text-primary hover:text-primary-dark mr-4 p-2 hover:bg-blue-50 rounded-full transition-colors"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Excluir"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* O Modal que gerencia o Formulário */}
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
          onSuccess={fetchProducts} // Quando salvar, recarrega a tabela
        />

      </div>
    </div>
  );
};
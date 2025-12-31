import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { Button } from '../../components/ui/Button';

// Interface do Produto
interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  requiresQuote: boolean;
  features: string[]; // Lista de checkmarks
  demoUrl: string;    // Link do Portfólio
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null; // Se vier null, é criação. Se vier objeto, é edição.
  onSuccess: () => void;
}

export const ProductModal = ({ isOpen, onClose, productToEdit, onSuccess }: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para upload de imagem
  
  // Estado do Formulário
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    images: [], // Array de imagens começa vazio
    category: 'Sites Institucionais',
    stock: 10,
    requiresQuote: false,
    features: [''],
    demoUrl: ''
  });

  // Preenche o formulário se for Edição
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        images: productToEdit.images || [],
        features: productToEdit.features || [''], // Garante que array exista
        demoUrl: productToEdit.demoUrl || '',
        requiresQuote: productToEdit.requiresQuote || false
      });
    } else {
      // Reseta para criação
      setFormData({
        name: '', price: 0, description: '', images: [], 
        category: 'Sites Institucionais', stock: 10, 
        requiresQuote: false, features: [''], demoUrl: ''
      });
    }
  }, [productToEdit, isOpen]);

  // === HANDLERS ===
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gerencia a lista dinâmica de Features (Checkmarks)
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // === UPLOAD DE IMAGEM (Firebase Storage) ===
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Cria referência única: pasta products / timestamp-nomearquivo
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      
      // Envia o arquivo
      await uploadBytes(storageRef, file);
      
      // Pega a URL pública
      const downloadURL = await getDownloadURL(storageRef);

      // Adiciona ao array de imagens
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, downloadURL]
      }));

    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar imagem. Verifique sua conexão.");
    } finally {
      setUploading(false);
    }
  };

  // Remove uma imagem da lista
  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // === SUBMIT (SALVAR) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpeza de dados (remover features vazias e converter números)
      const cleanData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        features: formData.features.filter(f => f.trim() !== ''), // Remove linhas vazias
        updatedAt: new Date()
      };

      if (productToEdit?.id) {
        // --- MODO EDIÇÃO ---
        const docRef = doc(db, 'products', productToEdit.id);
        await updateDoc(docRef, cleanData);
        alert('Produto atualizado com sucesso!');
      } else {
        // --- MODO CRIAÇÃO ---
        await addDoc(collection(db, 'products'), {
          ...cleanData,
          createdAt: new Date()
        });
        alert('Produto criado com sucesso!');
      }

      onSuccess(); // Recarrega a lista no pai
      onClose();   // Fecha modal
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              
              {/* Header do Modal */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b">
                <h3 className="text-lg font-bold leading-6 text-gray-900">
                  {productToEdit ? 'Editar Produto / Serviço' : 'Novo Produto / Serviço'}
                </h3>
                <button type="button" onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Linha 1: Nome e Categoria */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    >
                      <option value="Sites Institucionais">Sites Institucionais</option>
                      <option value="Sistemas de Gestão">Sistemas de Gestão</option>
                      <option value="Aplicativos Mobile">Aplicativos Mobile</option>
                      <option value="Consultoria">Consultoria</option>
                      <option value="Modelos">Modelos (Portfólio)</option>
                    </select>
                  </div>
                </div>

                {/* Linha 2: Preço e Configurações */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      disabled={formData.requiresQuote}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div className="flex items-center h-full pt-6">
                    <input
                      id="requiresQuote"
                      name="requiresQuote"
                      type="checkbox"
                      checked={formData.requiresQuote}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="requiresQuote" className="ml-2 block text-sm text-gray-900">
                      Requer Orçamento?
                    </label>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700">Link Demo (Portfólio)</label>
                     <input
                      type="url"
                      name="demoUrl"
                      placeholder="https://..."
                      value={formData.demoUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                  />
                </div>

                {/* === UPLOAD DE IMAGEM === */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Imagens do Produto</label>
                  
                  {/* Botão de Upload */}
                  <div className="flex items-center gap-4">
                    <label className={`cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <PhotoIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {uploading ? "Enviando..." : "Adicionar Foto"}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Grid de Preview das Imagens */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
                            title="Remover imagem"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lista de Features (Dinâmico) */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Lista de Inclusos (Checkmarks)</label>
                    <button type="button" onClick={addFeatureField} className="text-sm text-primary hover:underline flex items-center">
                      <PlusIcon className="h-4 w-4 mr-1" /> Adicionar Item
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="Ex: Domínio Grátis"
                          className="block w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeatureField(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões Finais */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                  <Button type="submit" isLoading={loading}>
                    {productToEdit ? 'Salvar Alterações' : 'Criar Produto'}
                  </Button>
                </div>

              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
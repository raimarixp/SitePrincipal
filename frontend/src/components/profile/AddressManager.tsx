import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { TrashIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Address {
  id?: string;
  name: string; // Ex: Casa, Trabalho
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const AddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const { register, handleSubmit, setValue, reset, watch, setFocus } = useForm<Address>();

  const cepValue = watch('cep');

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // Busca endereço via API ao digitar 8 dígitos
  useEffect(() => {
    const fetchCep = async () => {
      const cleanCep = cepValue?.replace(/\D/g, '');
      if (cleanCep?.length === 8) {
        try {
          const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
          if (!data.erro) {
            setValue('street', data.logradouro);
            setValue('neighborhood', data.bairro);
            setValue('city', data.localidade);
            setValue('state', data.uf);
            // Move o foco para o número automaticamente para agilizar
            setFocus('number');
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      }
    };
    fetchCep();
  }, [cepValue, setValue, setFocus]);

  const fetchAddresses = async () => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/addresses`));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
    setAddresses(data);
  };

  const onSubmit = async (data: Address) => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/addresses`), data);
      await fetchAddresses();
      setShowForm(false);
      reset();
    } catch (error) {
      console.error("Erro ao salvar endereço", error);
      alert("Erro ao salvar endereço. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Tem certeza que deseja excluir este endereço?')) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/addresses`, id));
      fetchAddresses();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-primary" />
          Meus Endereços
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancelar' : 'Adicionar Novo'}
        </button>
      </div>

      {/* Formulário de Adição */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 bg-gray-50 rounded-lg animate-fade-in border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nome do Local */}
            <div>
              <label htmlFor="addr_name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Local (Ex: Casa)</label>
              <input 
                id="addr_name"
                {...register('name', { required: true })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" 
                placeholder="Minha Casa" 
                autoComplete="off"
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="addr_cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input 
                id="addr_cep"
                {...register('cep', { required: true })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" 
                placeholder="00000-000" 
                maxLength={9}
                autoComplete="postal-code"
              />
            </div>

            {/* Rua (REMOVIDO READONLY) */}
            <div className="md:col-span-2">
              <label htmlFor="addr_street" className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
              <input 
                id="addr_street"
                {...register('street', { required: true })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border bg-white" 
                autoComplete="street-address"
              />
            </div>

            {/* Número */}
            <div>
              <label htmlFor="addr_number" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input 
                id="addr_number"
                {...register('number', { required: true })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" 
                autoComplete="address-line2"
              />
            </div>

            {/* Complemento */}
            <div>
              <label htmlFor="addr_comp" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input 
                id="addr_comp"
                {...register('complement')} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" 
                autoComplete="address-line3"
              />
            </div>

            {/* Bairro (REMOVIDO READONLY) */}
            <div>
              <label htmlFor="addr_district" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input 
                id="addr_district"
                {...register('neighborhood', { required: true })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border bg-white" 
                autoComplete="address-level3"
              />
            </div>

            {/* Cidade e UF */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label htmlFor="addr_city" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input 
                  id="addr_city"
                  {...register('city', { required: true })} 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border bg-gray-50" 
                  readOnly // Cidade e UF geralmente deixamos fixo pelo CEP, mas pode tirar se quiser
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label htmlFor="addr_state" className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                <input 
                  id="addr_state"
                  {...register('state', { required: true })} 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border bg-gray-50" 
                  readOnly 
                  autoComplete="address-level1"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Endereço'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Endereços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && !showForm && (
          <p className="text-gray-500 col-span-2 text-center py-8">
            Nenhum endereço cadastrado.
          </p>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-200 rounded-lg p-4 relative hover:border-primary transition-colors bg-gray-50/50 group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  {addr.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.neighborhood}, {addr.city} - {addr.state}
                </p>
                <p className="text-xs text-gray-500 mt-2 font-mono">{addr.cep}</p>
              </div>
              <button
                onClick={() => addr.id && handleDelete(addr.id)}
                className="text-gray-400 hover:text-primary p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Excluir endereço"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
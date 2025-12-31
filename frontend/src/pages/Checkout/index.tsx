import { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/helpers';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, query, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
  MapPinIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // States para dados do usuário (Editáveis no Checkout)
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');

  const auth = getAuth();
  const db = getFirestore();
  const functions = getFunctions();
  
  // Função auxiliar de máscara (opcional, mas recomendada para UX)
  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');

  // 1. Carregar Dados Iniciais
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        // A. Buscar Endereços
        const q = query(collection(db, `users/${user.uid}/addresses`));
        const addrSnapshot = await getDocs(q);
        const addrData = addrSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
        setAddresses(addrData);
        
        // Seleciona o primeiro endereço por padrão
        if (addrData.length > 0) setSelectedAddressId(addrData[0].id);

        // B. Buscar Dados do Perfil
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        // Prioridade: Dados do Banco > Dados do Auth > Vazio
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setCpf(data.cpf || '');
          setPhone(data.phone || '');
          setUserName(data.name || user.displayName || '');
        } else {
          setUserName(user.displayName || '');
        }

      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser, db]);

  // 2. Finalizar Compra
  const handleFinishOrder = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Validações
    if (!selectedAddressId) return alert("Selecione um endereço.");
    if (cartItems.length === 0) return;
    
    // Validação de Dados Pessoais (Não bloqueia navegação, pede preenchimento inline)
    if (!cpf || cpf.length < 11 || !phone || phone.length < 10) {
      alert("Por favor, preencha seu CPF e Celular corretamente para a emissão da nota.");
      return;
    }

    setProcessingPayment(true);
    try {
      // 1. SALVAR DADOS NO PERFIL AUTOMATICAMENTE
      // Isso garante que na próxima compra os dados já estejam lá
      await setDoc(doc(db, "users", user.uid), {
        cpf: cpf,
        phone: phone,
        name: userName, // Atualiza nome caso tenha editado
        updatedAt: new Date()
      }, { merge: true });

      // 2. Preparar Payload
      const deliveryAddress = addresses.find(a => a.id === selectedAddressId);
      const createPaymentFunction = httpsCallable(functions, 'createPayment');
      
      const payload = {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        deliveryAddress: deliveryAddress,
        payer: {
          name: userName || 'Cliente',
          email: user.email,
          cpf: cpf,
          phone: phone
        }
      };

      // 3. Chamar Backend
      const response: any = await createPaymentFunction(payload);
      const { init_point } = response.data;

      if (init_point) {
        window.location.href = init_point;
      } else {
        throw new Error("Link de pagamento não gerado");
      }

    } catch (error: any) {
      console.error("Erro checkout:", error);
      alert(`Erro: ${error.message || 'Falha ao processar pedido'}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-gray-500">Carregando informações...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio</h2>
        <Link to="/" className="mt-4 text-primary font-semibold hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* === COLUNA DA ESQUERDA === */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. SEÇÃO DE DADOS PESSOAIS (INLINE) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-800">
                <UserCircleIcon className="h-5 w-5 text-primary" />
                Dados para Nota Fiscal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
                  <input 
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-2 transition-colors bg-transparent"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Celular</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                    className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-2 transition-colors bg-transparent"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Seus dados serão salvos automaticamente no perfil para futuras compras.
              </p>
            </div>
            
            {/* 2. SEÇÃO DE ENDEREÇOS (CARDS DINÂMICOS) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <MapPinIcon className="h-5 w-5 text-primary" />
                  Endereço 
                </h2>
                <Link to="/minha-conta" className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Novo Endereço
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-3">Nenhum endereço encontrado.</p>
                  <Link to="/minha-conta" className="text-primary font-bold hover:underline">
                    Clique aqui para adicionar
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                        selectedAddressId === addr.id 
                          ? 'border-primary bg-blue-50/50 shadow-md' 
                          : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Indicador de Seleção */}
                      <div className={`absolute top-4 right-4 h-5 w-5 rounded-full border flex items-center justify-center ${
                        selectedAddressId === addr.id ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {selectedAddressId === addr.id && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>

                      <div className="pr-8">
                        <h3 className="font-bold text-gray-900">{addr.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {addr.street}, {addr.number}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">
                          {addr.neighborhood}, {addr.city}-{addr.state}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{addr.cep}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 3. LISTA DE ITENS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Resumo dos Itens</h2>
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <img
                      src={item.images[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="ml-4 flex flex-1 flex-col justify-center">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-1 mr-4">{item.name}</h3>
                        <p className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Qtd: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === COLUNA DA DIREITA (RESUMO) === */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Valores</h2>

              <div className="space-y-3 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {/* Espaço para Frete Futuro */}
                <div className="flex items-center justify-between text-green-600 text-sm">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary">{formatPrice(cartTotal)}</span>
              </div>

              <button
                onClick={handleFinishOrder}
                disabled={processingPayment || cartItems.length === 0}
                className="w-full group relative flex items-center justify-center rounded-xl border border-transparent bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                {processingPayment ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-5 w-5 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    Pagar Agora
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                <span className="font-medium">Ambiente 100% Seguro</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
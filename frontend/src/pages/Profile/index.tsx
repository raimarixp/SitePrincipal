import React, { useState, useEffect } from 'react';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'; // Importações do Firestore
import { 
  UserIcon, 
  MapPinIcon, 
  ShoppingBagIcon, 
  ArrowRightOnRectangleIcon,
  IdentificationIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { AddressManager } from '../../components/profile/AddressManager';

type TabOption = 'settings' | 'addresses' | 'orders';

// Função utilitária para máscaras (Pode mover para utils/helpers.ts depois)
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const Profile = () => {
  const { user, logout } = useAuth();
  const db = getFirestore();
  const [activeTab, setActiveTab] = useState<TabOption>('settings');
  
  // States do formulário
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Carregar dados do Firestore ao entrar na tela
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setNewEmail(user.email || '');
        setName(user.displayName || '');
        
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCpf(data.cpf || '');
            setPhone(data.phone || '');
            // Se o nome não estiver no Auth, tenta pegar do banco
            if (!user.displayName && data.name) setName(data.name);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    };
    loadUserData();
  }, [user, db]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    setLoading(true);

    try {
      // 1. Atualizar Auth (Email, Senha, Nome de Exibição)
      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // 2. Atualizar Firestore (Dados extras: CPF, Celular)
      // Usamos setDoc com merge: true para criar ou atualizar sem apagar o resto
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        cpf: cpf,
        phone: phone,
        email: newEmail, // Bom ter o email no banco também para buscas
        updatedAt: new Date()
      }, { merge: true });

      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      setNewPassword(''); 
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ text: 'Por segurança, faça login novamente para alterar email ou senha.', type: 'error' });
      } else {
        setMessage({ text: 'Erro ao atualizar. Verifique os dados.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (logout) await logout();
  };

  if (!user) return null; // Ou redirecionamento

  return (
    <div className="pt-32 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
          <p className="text-gray-600 mt-1">Mantenha seus dados atualizados para agilizar suas compras.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* MENU LATERAL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-32">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{name || 'Olá, Cliente'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2 space-y-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <UserIcon className="h-5 w-5" />
                  Dados Pessoais
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'addresses' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <MapPinIcon className="h-5 w-5" />
                  Meus Endereços
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Meus Pedidos
                </button>

                <div className="pt-2 mt-2 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sair da Conta
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="lg:col-span-3">
            
            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <UserIcon className="h-6 w-6 text-primary" />
                  Dados Pessoais
                </h2>
                
                {message && (
                  <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                    message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {message.text}
                  </div>
                )}
                
                <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CPF */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <IdentificationIcon className="h-4 w-4" /> CPF
                      </label>
                      <input 
                        type="text" 
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={cpf} 
                        onChange={e => setCpf(maskCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                    </div>

                    {/* Celular */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <DevicePhoneMobileIcon className="h-4 w-4" /> Celular / WhatsApp
                      </label>
                      <input 
                        type="tel" 
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={phone} 
                        onChange={e => setPhone(maskPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dados de Acesso</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                          value={newEmail} 
                          onChange={e => setNewEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                        <input 
                          type="password" 
                          className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Deixe em branco para manter"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <AddressManager />
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Histórico de Pedidos</h3>
                <p className="text-gray-500 mt-2">Seus pedidos aparecerão aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
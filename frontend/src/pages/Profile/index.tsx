import { useState } from 'react';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export const Profile = () => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage('');

    try {
      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro: Faça login novamente para atualizar dados sensíveis.');
    }
  };

  if (!user) return <div className="pt-32 text-center">Faça login para ver seu perfil.</div>;

  return (
    <div className="pt-32 pb-12 container mx-auto px-6">
      <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Menu Lateral (Exemplo) */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <ul className="space-y-2">
            <li className="font-semibold text-primary">Configurações</li>
            <li className="text-gray-600 hover:text-primary cursor-pointer">Meus Pedidos</li>
          </ul>
        </div>

        {/* Formulário de Configuração */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Dados de Acesso</h2>
          {message && <div className={`p-3 rounded mb-4 ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
          
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input 
                type="email" 
                className="w-full border p-2 rounded"
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nova Senha (deixe em branco para manter)</label>
              <input 
                type="password" 
                className="w-full border p-2 rounded"
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Salvar Alterações</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
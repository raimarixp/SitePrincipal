import { type User } from 'firebase/auth';
import { Button } from '../../../components/ui/Button';

export const Settings = ({ user }: { user: User | null }) => {
  return (
    <div className="max-w-2xl">
       <h2 className="text-2xl font-bold text-white mb-8">Dados da Conta</h2>

       <div className="space-y-6 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
          
          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-400">Nome de Exibição</label>
            <input 
              type="text" 
              defaultValue={user?.displayName || ''}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Seu nome"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-400">Endereço de E-mail</label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
            />
            <p className="text-xs text-neutral-600">O e-mail não pode ser alterado por segurança.</p>
          </div>

          <div className="pt-4">
            <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
               Salvar Alterações
            </Button>
          </div>

       </div>
    </div>
  );
};
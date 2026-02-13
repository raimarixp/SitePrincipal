import { motion } from 'framer-motion';
import { FolderIcon, ClockIcon } from '@heroicons/react/24/outline';

// Mock data (substituir depois pela busca no Firebase 'orders')
const MOCK_ORDERS = [
  { id: 1, title: 'E-commerce Moda', status: 'Em Desenvolvimento', date: '12/10/2023', progress: 65 },
  { id: 2, title: 'Landing Page Advocacia', status: 'Concluído', date: '05/09/2023', progress: 100 },
];

export const MyProjects = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Meus Projetos</h2>
        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
          {MOCK_ORDERS.length} Ativos
        </span>
      </div>

      <div className="grid gap-4">
        {MOCK_ORDERS.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-primary/30"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${order.progress === 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <FolderIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{order.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" /> {order.date}
                    </span>
                    <span>•</span>
                    <span className={order.progress === 100 ? "text-emerald-400" : "text-blue-400"}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full md:w-48">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-neutral-500">Progresso</span>
                  <span className="text-white font-mono">{order.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${order.progress}%` }} 
                  />
                </div>
              </div>

            </div>
          </motion.div>
        ))}
        
        {MOCK_ORDERS.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-neutral-500">Nenhum projeto encontrado.</p>
            </div>
        )}
      </div>
    </div>
  );
};
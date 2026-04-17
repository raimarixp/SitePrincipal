import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { EnvelopeIcon, CheckCircleIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 relative z-10">
      {/* Container Principal com padding seguro para mobile */}
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-black italic tracking-tight text-white sm:text-5xl drop-shadow-sm">
            Fale Conosco
          </h1>
          <p className="mt-4 text-lg text-gray-100 font-medium opacity-90">
            Tem alguma dúvida ou quer fazer um orçamento personalizado? Envie uma mensagem.
          </p>
        </div>

        {/* ESTRUTURA BLINDADA PARA MOBILE E DESKTOP */}
        {/* Empilha no celular (flex-col), lado a lado no desktop (lg:flex-row) */}
        <div className="flex flex-col lg:flex-row max-w-6xl mx-auto bg-transparent lg:bg-[#0B0428] rounded-[2rem] lg:shadow-2xl overflow-hidden gap-8 lg:gap-0">
          
          {/* COLUNA DA ESQUERDA: Informações de Contato (Fundo Azul) */}
          <div className="w-full lg:w-2/5 bg-[#0B0428] p-8 md:p-12 text-white rounded-[2rem] lg:rounded-none lg:rounded-l-[2rem] shadow-2xl lg:shadow-none z-10 border border-white/5 lg:border-none">
            <h3 className="text-2xl font-bold text-white mb-8">Canais de Atendimento</h3>
            
            <div className="space-y-8">
              {/* Item Email */}
              <div className="flex items-start gap-4">
                <div className="bg-[#3C26F6] p-3 md:p-4 rounded-2xl text-white shadow-[0_0_15px_rgba(60,38,246,0.4)] flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-lg">Email</p>
                  {/* break-all salva o layout no celular para o email longo */}
                  <p className="text-gray-300 text-sm md:text-base break-all">Atendimentowebuild.dev@gmail.com</p>
                </div>
              </div>

              {/* Item Telefone */}
              <div className="flex items-start gap-4">
                <div className="bg-[#3C26F6] p-3 md:p-4 rounded-2xl text-white shadow-[0_0_15px_rgba(60,38,246,0.4)] flex-shrink-0">
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">WhatsApp / Telefone</p>
                  <p className="text-gray-300 text-sm md:text-base">(68) 99908-2029</p>
                </div>
              </div>

              {/* Item Endereço */}
              <div className="flex items-start gap-4">
                <div className="bg-[#3C26F6] p-3 md:p-4 rounded-2xl text-white shadow-[0_0_15px_rgba(60,38,246,0.4)] flex-shrink-0">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Endereço</p>
                  <p className="text-gray-300 text-sm md:text-base">Rua S1, tucumã, 938 - Rio Branco, AC</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA: Formulário (Branco) */}
          <div className="w-full lg:w-3/5 bg-white p-8 md:p-12 text-gray-900 rounded-[2rem] lg:rounded-none lg:rounded-r-[2rem] shadow-2xl relative">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mensagem Enviada!</h3>
                <p className="text-gray-500 mt-2 mb-8">Em breve entraremos em contato.</p>
                <Button variant="outline" className="w-full rounded-full" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3C26F6] focus:border-[#3C26F6] outline-none transition-all"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3C26F6] focus:border-[#3C26F6] outline-none transition-all"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3C26F6] focus:border-[#3C26F6] outline-none resize-none transition-all"
                    placeholder="Como podemos ajudar?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg rounded-full bg-[#3C26F6] hover:bg-[#2D18E5] text-white font-bold shadow-[0_0_20px_rgba(60,38,246,0.3)] border-none transition-colors" isLoading={loading}>
                  Enviar Mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
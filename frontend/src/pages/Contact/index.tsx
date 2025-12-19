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
    // MUDANÇA: Removemos bg-gray-50. Adicionamos relative z-10 para flutuar sobre o gradiente.
    <div className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* Texto Branco para contraste com o gradiente */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl drop-shadow-sm">
            Fale Conosco
          </h1>
          <p className="mt-4 text-lg text-gray-100 font-medium opacity-90">
            Tem alguma dúvida ou quer fazer um orçamento personalizado? Envie uma mensagem.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          
          {/* COLUNA DA ESQUERDA: Informações de Contato */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-8">Canais de Atendimento</h3>
              
              <div className="space-y-8">
                {/* Item Email */}
                <div className="flex items-start gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl text-white backdrop-blur-md shadow-lg">
                    <EnvelopeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Email</p>
                    <p className="text-gray-200">contato@suaempresa.com.br</p>
                  </div>
                </div>

                {/* Item Telefone */}
                <div className="flex items-start gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl text-white backdrop-blur-md shadow-lg">
                    <PhoneIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">WhatsApp / Telefone</p>
                    <p className="text-gray-200">(11) 99999-9999</p>
                  </div>
                </div>

                {/* Item Endereço */}
                <div className="flex items-start gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl text-white backdrop-blur-md shadow-lg">
                    <MapPinIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Endereço</p>
                    <p className="text-gray-200">Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA: Formulário */}
          {/* MUDANÇA: Este container é Branco Sólido (bg-white) para destacar o form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl">
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
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
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
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
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
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-all"
                    placeholder="Como podemos ajudar?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg rounded-full font-bold shadow-lg" isLoading={loading}>
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
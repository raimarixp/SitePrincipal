import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import { ArrowRightIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export const ContactCTA = () => {
  return (
    <section className="relative py-32 bg-neutral-950 overflow-hidden">
      
      {/* Container Principal */}
      <div className="container mx-auto px-6 relative z-10">
        
        {/* === O CARD "PORTAL" === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[3rem] bg-neutral-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
            {/* === BACKGROUND ANIMADO DO CARD === */}
            <div className="absolute inset-0 z-0">
                {/* 1. Gradiente de Fundo Profundo */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-neutral-900 to-black" />
                
                {/* 2. Grid em Movimento (Warp Effect) */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* 3. Orbe de Energia Central */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
                
                {/* 4. Partículas/Ruído */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* === CONTEÚDO === */}
            <div className="relative z-10 px-6 py-20 md:py-28 text-center sm:px-12 md:px-24">
            
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-neutral-300 text-xs font-bold tracking-widest uppercase">
                        Vagas abertas para novos projetos
                    </span>
                </motion.div>

                <h2 className="mx-auto max-w-4xl text-4xl md:text-6xl font-black tracking-tight text-white mb-8 leading-[1.1]">
                    Pronto para construir o <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">
                        futuro do seu negócio?
                    </span>
                </h2>
                
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed">
                    Não deixe sua ideia parada no papel. Nossa equipe de engenharia está pronta para desenhar a arquitetura escalável que sua empresa precisa.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/contato">
                        {/* BOTÃO PRIMÁRIO: Azul Vibrante com Glow */}
                        <Button 
                            size="lg" 
                            className="group relative rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white border-none min-w-[200px] text-lg font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Iniciar Projeto
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Efeito de brilho passando no botão */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                        </Button>
                    </Link>
                    
                    <Link to="/whatsapp">
                        {/* BOTÃO SECUNDÁRIO: Glassmorphism */}
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="rounded-full px-10 py-6 border border-white/20 bg-white/5 hover:bg-white/10 text-white min-w-[200px] text-lg font-medium backdrop-blur-md flex items-center justify-center gap-2 group"
                        >
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                            Conversar no Whats
                        </Button>
                    </Link>
                </div>

                <p className="mt-8 text-sm text-neutral-500 font-medium">
                    Resposta garantida em até 24h úteis.
                </p>

            </div>
        </motion.div>
      </div>
    </section>
  );
};
import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Color } from 'three';
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence 
} from 'framer-motion';
import { ArrowUpRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- CONFIGURAÇÃO ---
// Substitua por sua logo em PNG/WebP (Fundo transparente recomendado)
const LOGO_URL = "https://i.ibb.co/ZRWWdBwj/LOGO-WE-BUILD-branco-png.png"; 

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// 1. LIQUID GRADIENT SHADER (WEBGL BACKGROUND)
// ==========================================

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float wave1 = sin(uv.x * 10.0 + uTime * 0.5 + uv.y * 5.0) * 0.2;
    float wave2 = sin(uv.y * 12.0 + uTime * 0.8 + uv.x * 4.0) * 0.2;
    float wave3 = sin((uv.x + uv.y) * 8.0 + uTime * 0.3) * 0.1;
    float noise = wave1 + wave2 + wave3;
    vec3 color = mix(uColor1, uColor2, uv.y + noise);
    color = mix(color, uColor3, sin(uv.x + uTime * 0.2) * 0.5 + 0.5);
    float electric = smoothstep(0.4, 0.42, noise + 0.2) - smoothstep(0.42, 0.45, noise + 0.2);
    color += vec3(0.5, 0.8, 1.0) * electric * 0.3;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GradientMesh = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new Color('#020617') },
      uColor2: { value: new Color('#1e1b4b') },
      uColor3: { value: new Color('#2563eb') },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      // @ts-ignore
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime() * 0.7;
    }
  });

  return (
    <mesh ref={mesh} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const LiquidGradient = () => {
  return (
    <div className="absolute inset-0 w-full h-full opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}> {/* DPR reduzido levemente para performance */}
        <GradientMesh />
      </Canvas>
    </div>
  );
};

// ==========================================
// 2. TYPES & DATA
// ==========================================

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

interface StoryStep {
  id: number;
  title: string;
  text: string;
  highlight: string;
}

const STORY_STEPS: StoryStep[] = [
  {
    id: 1,
    title: "A Regra dos 3 Segundos",
    text: "Velocidade é dinheiro. Eliminamos o carregamento lento para que seu cliente não abandone o site antes de ver sua oferta. Otimização no nível do byte.",
    highlight: "Performance",
  },
  {
    id: 2,
    title: "Mobile First Nativo",
    text: "O mundo cabe na palma da mão. Não adaptamos sites para celular; projetamos para o toque, garantindo fluidez nativa em qualquer viewport.",
    highlight: "Responsividade",
  },
  {
    id: 3,
    title: "Arquitetura Blindada",
    text: "Segurança não é opcional. Utilizamos React, TypeScript e Serverless para criar um ecossistema imune a vulnerabilidades comuns.",
    highlight: "Engenharia",
  },
  {
    id: 4,
    title: "Conversão Obsessiva",
    text: "Não entregamos apenas código bonito. Entregamos uma máquina de vendas com UX focado na psicologia do consumidor.",
    highlight: "Resultado",
  }
];

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Lumina Real Estate",
    category: "Imobiliária Premium",
    description: "Plataforma de alto padrão com tour virtual 360º.",
    image: "https://images.unsplash.com/photo-1600596542815-e3289cab6f58?q=80&w=2600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Nexus SaaS",
    category: "Fintech Dashboard",
    description: "Analytics em tempo real com visualização de dados complexos.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Gastro Fusion",
    category: "Food Service",
    description: "Cardápio imersivo focado em fotografia gastronômica.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Aura Store",
    category: "E-commerce",
    description: "Loja minimalista com experiência de compra 'one-click'.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop",
  }
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    // Backdrop blur reduzido para 'md' para aliviar a GPU
    "relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-md shadow-2xl",
    className
  )}>
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// ==========================================
// 4. SCROLLY TELLING PAGE
// ==========================================

export const ScrollyTelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- ANIMAÇÕES (Sincronizadas com Scroll) ---
  const logoTop = useTransform(scrollYProgress, [0, 0.1, 0.8], ["5%", "15%", "85%"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.6]);
  const logoOpacity = useTransform(scrollYProgress, [0.8, 0.85], [1, 0]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);


  return (
    <section ref={containerRef} className="relative min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* === FUNDO ANIMADO === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidGradient />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* === TRAVELING LOGO (Agora com PNG leve) === */}
      <motion.div 
        style={{ top: logoTop, scale: logoScale, opacity: logoOpacity }}
        className="fixed left-0 right-0 mx-auto w-fit z-50 pointer-events-none flex flex-col items-center justify-center will-change-transform"
      >
          <div className="relative group">
            <div className="absolute -inset-2 bg-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
            
            {/* Logo Container */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden p-3">
                {/* Substituição do SVG por IMG */}
                <img 
                  src={LOGO_URL}  
                />
            </div>
          </div>
          
          <motion.div 
            style={{ height: useTransform(scrollYProgress, [0, 0.1], [0, 100]) }}
            className="w-px bg-gradient-to-b from-blue-500/50 to-transparent mt-4" 
          />
      </motion.div>

      {/* === 1. HERO SECTION === */}
      <div className="relative z-10 h-screen flex flex-col justify-between items-center py-12 px-4">
         
         <motion.div style={{ opacity: heroOpacity }} className="flex flex-col items-center gap-4 mt-8">
            <span className="text-sm font-mono text-neutral-400 tracking-[0.5em] uppercase">
              {/* PODE TER TEXTO AQUI ACIMA DO TITULO*/}
            </span>
         </motion.div>

         <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="flex flex-col items-center text-center space-y-4 max-w-4xl -mt-24 md:-mt-32" 
         >
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
                WE<span className="text-blue-500">BUILD</span>.
             </h1>
             <p className="text-xl md:text-3xl text-neutral-300 font-light tracking-widest uppercase drop-shadow-md">
                Digital Experience
             </p>
             <p className="mt-6 text-base md:text-lg text-neutral-400 max-w-lg font-light leading-relaxed tracking-wide">
                Unimos design visceral e engenharia de ponta para criar produtos que dominam mercados.
             </p>
         </motion.div>

         <motion.div 
            style={{ opacity: heroOpacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-neutral-400 pb-8"
         >
            <span className="text-xs uppercase tracking-widest font-medium">Role para descobrir</span>
            <ChevronDownIcon className="w-5 h-5" />
         </motion.div>
      </div>

      {/* === 2. NARRATIVA === */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32 space-y-24 md:space-y-32">
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent -translate-x-1/2 hidden md:block" />

         {STORY_STEPS.map((step, index) => (
             <div key={step.id} className={cn(
                 "flex items-center w-full relative",
                 index % 2 === 0 ? "justify-start" : "justify-end"
             )}>
                 <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 z-20">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20%", once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                        "w-full md:w-[42%] relative",
                        index % 2 === 0 ? "text-right md:pr-12" : "text-left md:pl-12"
                    )}
                 >
                     <GlassCard className="p-8 group hover:border-blue-500/30 transition-colors duration-500">
                        <div className={cn("flex flex-col gap-3", index % 2 === 0 ? "items-end" : "items-start")}>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase">
                                0{step.id} — {step.highlight}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                {step.title}
                            </h3>
                            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
                                {step.text}
                            </p>
                        </div>
                     </GlassCard>
                 </motion.div>
             </div>
         ))}
      </div>

      {/* === 3. DEMOS INTERATIVOS (NOVO LAYOUT LEVE) === */}
      <div className="relative z-20 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-4 py-32 flex flex-col lg:flex-row gap-12 items-start justify-center min-h-[80vh]">
          
          {/* Menu Lateral (Controles) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-2 z-20">
            <div className="mb-8 pl-2">
                <h3 className="text-xs font-mono text-blue-500 tracking-[0.2em] uppercase mb-3">Portfolio Select</h3>
                <h2 className="text-4xl font-bold text-white leading-tight">Nossos<br/>Cases</h2>
            </div>

            {PROJECTS.map((project, index) => (
              <div 
                key={project.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "group cursor-pointer p-5 rounded-xl transition-all duration-300 relative overflow-hidden border",
                  activeIndex === index 
                    ? "bg-white/[0.08] border-white/10" 
                    : "bg-transparent border-transparent hover:bg-white/[0.03]"
                )}
              >
                {activeIndex === index && (
                    <motion.div 
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"
                        transition={{ duration: 0.3 }}
                    />
                )}
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h4 className={cn("text-lg font-medium transition-colors", activeIndex === index ? "text-white" : "text-neutral-400")}>
                            {project.name}
                        </h4>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-mono">{project.category}</p>
                    </div>
                    <ArrowUpRightIcon className={cn(
                        "w-5 h-5 transition-all duration-300",
                        activeIndex === index ? "text-blue-500 opacity-100 translate-x-0" : "text-neutral-700 opacity-0 -translate-x-2"
                    )} />
                </div>
              </div>
            ))}
          </div>

          {/* Display de Imagem Única (Substitui o 3D Stack) */}
          <div className="w-full lg:w-2/3 relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Imagem de Fundo */}
                    <img 
                        src={PROJECTS[activeIndex].image} 
                        alt={PROJECTS[activeIndex].name} 
                        className="w-full h-full object-cover opacity-80"
                    />
                    
                    {/* Overlay Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Informações do Projeto */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl">
                        <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                {PROJECTS[activeIndex].name}
                            </h3>
                            <p className="text-neutral-300 text-lg leading-relaxed mb-8 max-w-lg">
                                {PROJECTS[activeIndex].description}
                            </p>
                            <button className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-wide transition-colors flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                                Ver Case Completo
                                <ArrowUpRightIcon className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

    </section>
  );
};
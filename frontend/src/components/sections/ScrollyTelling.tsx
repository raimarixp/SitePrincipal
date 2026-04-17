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
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ElectricBadge } from '../ui/EletricBadge';

// --- CONFIGURAÇÃO ---
const LOGO_URL = "https://i.ibb.co/xKGYP68M/LOGO-WB-projeto-affinity.jpg"; 

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
    
    // Transição suave entre Preto, Índigo Profundo e Blurple
    vec3 color = mix(uColor1, uColor2, uv.y + noise);
    color = mix(color, uColor3, sin(uv.x + uTime * 0.2) * 0.5 + 0.5);
    
    // Brilho elétrico ajustado para o tom neon
    float electric = smoothstep(0.4, 0.42, noise + 0.2) - smoothstep(0.42, 0.45, noise + 0.2);
    color += vec3(0.6, 0.4, 1.0) * electric * 0.5;
    
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
      uColor1: { value: new Color('#000000') }, // Preto Absoluto
      uColor2: { value: new Color('#0B0428') }, // Índigo Profundo
      uColor3: { value: new Color('#3C26F6') }, // Blurple (Primária)
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
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
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
  demoUrl: string;
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
    title: "Performance que Vende",
    text: "Chega de site lento. Velocidade é conversão. Entregamos uma experiência ultrarrápida, otimizada no nível do código, para prender a atenção do cliente do primeiro ao último clique.",
    highlight: "Performance",
  },
  {
    id: 2,
    title: "Fluidez Nativa em Qualquer Tela",
    text: "Projetamos para a ponta dos dedos. Arquitetura mobile-first que elimina falhas de adaptação e garante performance nativa do smartphone ao desktop.",
    highlight: "Responsividade",
  },
  {
    id: 3,
    title: "Segurança que Gera Confiança",
    text: "Site fora do ar ou invadido é prejuízo na certa. Por isso, construímos sua plataforma sobre a infraestrutura do Google Firebase, com React e TypeScript: um ecossistema blindado que mantém seu negócio protegido e no ar 24/7.",
    highlight: "Engenharia",
  },
  {
    id: 4,
    title: "Psicologia Aplicada à Conversão",
    text: "Cada detalhe do seu projeto é pensado na psicologia do consumidor para transformar visita em cliente e clique em receita.",
    highlight: "Resultado",
  }
];

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Ecommerce esportivo",
    category: "Design Premium",
    description: "Plataforma de alto padrão com tour virtual 360º.",
    image: "https://i.ibb.co/4nGdpRPt/image.png",
    demoUrl: "https://sr-sportline-site-prod.web.app/", 
  },
  {
    id: "2",
    name: "Ecommerce Moda",
    category: "100% Personalizado",
    description: "Analytics em tempo real com visualização de dados complexos.",
    image: "https://i.ibb.co/8npFWfNR/image.png",
    demoUrl: "https://zfarm-site-roupa.web.app/",
  },
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
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

  // --- ANIMAÇÕES REFINADAS E OTIMIZADAS PARA MOBILE (GPU) ---
  // Trocamos 'top' por 'y' para evitar repaints no DOM e travar o celular
  const logoOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 0.85], [0, 1, 1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.1, 0.8], ["5vh", "15vh", "85vh"]); 
  const logoScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.6]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -80]);

  return (
    <section 
      ref={containerRef} 
      style={{ position: 'relative' }} 
      className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-[#3C26F6]/30"
    >
      
      {/* === FUNDO ANIMADO === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidGradient />
        {/* SVG em Base64 - Resolve o erro 403 e carrega instantaneamente */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* === TRAVELING LOGO OTIMIZADO === */}
      <motion.div 
        style={{ y: logoY, scale: logoScale, opacity: logoOpacity }}
        // will-change-transform e transform-gpu ativam a aceleração de hardware
        className="fixed top-0 left-0 right-0 mx-auto w-fit z-50 pointer-events-none flex flex-col items-center justify-center will-change-transform transform-gpu"
      >
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#3C26F6] rounded-full blur-xl opacity-20 transition duration-1000" />
            
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden p-3">
                <img src={LOGO_URL} alt="Webuild Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <motion.div 
            style={{ height: useTransform(scrollYProgress, [0, 0.1], [0, 100]) }}
            className="w-px bg-gradient-to-b from-[#3C26F6]/50 to-transparent mt-4 will-change-transform" 
          />
      </motion.div>

      {/* === 1. HERO SECTION (HIGH-END) === */}
      <div className="relative z-10 min-h-[90vh] flex flex-col justify-center items-center px-4 pt-20">
         
         <ElectricBadge 
            text="Engenharia de Alta Performance" 
            opacityStyle={heroOpacity} 
         />

         <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            // Aceleração de hardware na saída do hero
            className="relative flex flex-col items-center text-center max-w-5xl will-change-transform transform-gpu" 
         >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#3C26F6]/10 blur-[130px] -z-10 pointer-events-none" />
             
             <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-black italic tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                WE<span className="pr-2 md:pr-4 text-transparent bg-clip-text bg-gradient-to-br from-[#3C26F6] to-indigo-500 drop-shadow-[0_0_40px_rgba(60,38,246,0.4)]">BUILD</span><span className="text-[#3C26F6]">.</span>
             </h1>
             
             <p className="mt-8 text-lg md:text-2xl text-neutral-400 max-w-2xl font-light leading-relaxed tracking-wide">
                Não fazemos apenas sites. Construímos pontes digitais robustas entre a sua visão e o futuro do mercado.
             </p>
         </motion.div>

         <motion.div 
            style={{ opacity: heroOpacity }}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12 flex flex-col items-center gap-3 text-neutral-500 will-change-transform transform-gpu"
         >
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] font-bold">Explore</span>
            <div className="w-px h-14 bg-gradient-to-b from-neutral-500 to-transparent" />
         </motion.div>
      </div>

      {/* === 2. NARRATIVA === */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32 space-y-24 md:space-y-32">
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#3C26F6]/30 to-transparent -translate-x-1/2 hidden md:block" />

         {STORY_STEPS.map((step, index) => (
             <div key={step.id} className={cn(
                 "flex items-center w-full relative",
                 index % 2 === 0 ? "justify-start" : "justify-end"
             )}>
                 <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 z-20">
                    <div className="w-3 h-3 bg-[#3C26F6] rounded-full shadow-[0_0_15px_rgba(60,38,246,0.8)]" />
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20%", once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                        "w-full md:w-[42%] relative will-change-transform transform-gpu",
                        index % 2 === 0 ? "text-right md:pr-12" : "text-left md:pl-12"
                    )}
                 >
                     <GlassCard className="p-8 group hover:border-[#3C26F6]/40 transition-colors duration-500">
                        <div className={cn("flex flex-col gap-3", index % 2 === 0 ? "items-end" : "items-start")}>
                            <span className="inline-block px-3 py-1 rounded-full bg-[#3C26F6]/10 border border-[#3C26F6]/20 text-[#7A6AFA] font-mono text-xs tracking-widest uppercase">
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

      {/* === 3. DEMOS INTERATIVOS === */}
      <div className="relative z-20 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-4 py-32 flex flex-col lg:flex-row gap-12 items-start justify-center min-h-[80vh]">
          
          {/* Menu Lateral (Controles) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-2 z-20">
            <div className="mb-8 pl-2">
                <h3 className="text-xs font-mono text-[#3C26F6] tracking-[0.2em] uppercase mb-3">Portfolio Select</h3>
                <h2 className="text-4xl font-bold text-white leading-tight">Nossos<br/>Cases</h2>
            </div>

            {PROJECTS.map((project, index) => (
              <div 
                key={project.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)} // Adicionado onClick para funcionar bem no Mobile
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
                        className="absolute inset-0 bg-gradient-to-r from-[#3C26F6]/30 to-transparent"
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
                        activeIndex === index ? "text-[#3C26F6] opacity-100 translate-x-0" : "text-neutral-700 opacity-0 -translate-x-2"
                    )} />
                </div>
              </div>
            ))}
          </div>

          {/* Display de Imagem Única */}
          <div className="w-full lg:w-2/3 relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl group transform-gpu">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute inset-0 w-full h-full will-change-transform"
                >
                    <img 
                        src={PROJECTS[activeIndex].image} 
                        alt={PROJECTS[activeIndex].name} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl">
                        <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="will-change-transform transform-gpu"
                        >
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                {PROJECTS[activeIndex].name}
                            </h3>
                            <p className="text-neutral-300 text-lg leading-relaxed mb-8 max-w-lg">
                                {PROJECTS[activeIndex].description}
                            </p>
                            
                            <a 
                                href={PROJECTS[activeIndex].demoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3C26F6] hover:bg-[#2D18E5] text-white text-sm font-bold tracking-wide transition-colors shadow-[0_0_30px_rgba(60,38,246,0.3)]"
                            >
                                Ver Case Completo
                                <ArrowUpRightIcon className="w-4 h-4" />
                            </a>
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
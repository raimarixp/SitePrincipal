import { useEffect, useRef } from 'react';
import { motion, MotionValue } from 'framer-motion';

// --- MOTOR GRÁFICO REESCRITO PARA FLUIDEZ CONTÍNUA ---
class SmoothElectricBorder {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  width: number; height: number; 
  octaves: number; lacunarity: number; gain: number; amplitude: number; frequency: number;
  displacement: number; speed: number; borderOffset: number; borderRadius: number; 
  lineWidth: number; color: string;
  animationId: number | null; time: number; lastFrameTime: number;
  
  // Variáveis para pre-cálculo da rota perfeita
  points: {x: number, y: number}[];
  pathLength: number;
  needsUpdate: boolean;

  constructor(canvas: HTMLCanvasElement, options: any = {}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.octaves = options.octaves || 5;
    this.lacunarity = options.lacunarity || 2.0;
    this.gain = options.gain || 0.5;
    this.amplitude = options.amplitude || 0.1;
    this.frequency = options.frequency || 5;
    this.displacement = options.displacement || 5; 
    this.speed = options.speed || 1.5;
    this.borderOffset = options.borderOffset || 6;
    this.borderRadius = options.borderRadius || 999; 
    this.lineWidth = options.lineWidth || 1.5;
    this.color = options.color || "#7A6AFA"; 

    this.animationId = null;
    this.time = 0;
    this.lastFrameTime = performance.now();
    
    this.points = [];
    this.pathLength = 0;
    this.needsUpdate = true;
  }

  random(x: number) { return (Math.sin(x * 12.9898) * 43758.5453) % 1; }

  noise2D(x: number, y: number) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const a = this.random(i + j * 57), b = this.random(i + 1 + j * 57);
    const c = this.random(i + (j + 1) * 57), d = this.random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3.0 - 2.0 * fx), uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  // Ruído circular: garante que o começo e o fim da forma se encaixem perfeitamente (Sem quinas)
  octavedNoiseCircle(nx: number, ny: number, seedOffset: number) {
    let y = 0, amp = this.amplitude, freq = this.frequency;
    for (let i = 0; i < this.octaves; i++) {
      y += amp * this.noise2D(nx * freq + seedOffset, ny * freq);
      freq *= this.lacunarity;
      amp *= this.gain;
    }
    return y;
  }

  getCornerPoint(centerX: number, centerY: number, radius: number, startAngle: number, arcLength: number, progress: number) {
    const angle = startAngle + progress * arcLength;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  }

  getRoundedRectPoint(t: number, left: number, top: number, width: number, height: number, radius: number) {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;
    let accumulated = 0;

    if (distance <= accumulated + straightWidth) return { x: left + radius + ((distance - accumulated) / straightWidth) * straightWidth, y: top };
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) return { x: left + width, y: top + radius + ((distance - accumulated) / straightHeight) * straightHeight };
    accumulated += straightHeight;
    if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
    accumulated += cornerArc;
    if (distance <= accumulated + straightWidth) return { x: left + width - radius - ((distance - accumulated) / straightWidth) * straightWidth, y: top + height };
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) return { x: left, y: top + height - radius - ((distance - accumulated) / straightHeight) * straightHeight };
    accumulated += straightHeight;
    return this.getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
  }

  // Gera a rota apenas 1x (salva GPU e remove os engasgos)
  generatePath() {
    const left = this.borderOffset;
    const top = this.borderOffset;
    const borderWidth = this.width - 2 * this.borderOffset;
    const borderHeight = this.height - 2 * this.borderOffset;
    
    if (borderWidth <= 0 || borderHeight <= 0) return;

    const maxRadius = Math.min(borderWidth, borderHeight) / 2;
    const radius = Math.min(this.borderRadius, maxRadius);
    const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
    const sampleCount = Math.floor(approximatePerimeter / 2);

    this.points = [];
    this.pathLength = 0;

    for (let i = 0; i < sampleCount; i++) {
      const progress = i / sampleCount;
      const point = this.getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

      // Converte o progresso em um círculo para garantir fluidez contínua
      const angle = progress * Math.PI * 2;
      const nx = Math.cos(angle);
      const ny = Math.sin(angle);

      const xNoise = this.octavedNoiseCircle(nx, ny, 0);
      const yNoise = this.octavedNoiseCircle(nx, ny, 100);

      const displacedX = point.x + xNoise * this.displacement;
      const displacedY = point.y + yNoise * this.displacement;

      this.points.push({ x: displacedX, y: displacedY });

      // Calcula o tamanho exato da linha percorrida (Isso remove a freada)
      if (i > 0) {
        const dx = displacedX - this.points[i-1].x;
        const dy = displacedY - this.points[i-1].y;
        this.pathLength += Math.sqrt(dx*dx + dy*dy);
      }
    }

    // Fecha a medida calculando a distância do último para o primeiro ponto
    if (this.points.length > 1) {
      const dx = this.points[0].x - this.points[this.points.length-1].x;
      const dy = this.points[0].y - this.points[this.points.length-1].y;
      this.pathLength += Math.sqrt(dx*dx + dy*dy);
    }

    this.needsUpdate = false;
  }

  draw(currentTime = performance.now()) {
    if (!this.canvas || !this.ctx) return;
    
    // Auto-ajusta e regera a rota se a tela for redimensionada
    if (this.canvas.width !== this.canvas.parentElement?.clientWidth) {
      this.canvas.width = (this.canvas.parentElement?.clientWidth || 300) + 20;
      this.canvas.height = (this.canvas.parentElement?.clientHeight || 40) + 20;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.needsUpdate = true;
    }

    if (this.needsUpdate) {
      this.generatePath();
    }

    // Trava para não ter pulos gigantes caso o usuário troque de aba
    let deltaTime = (currentTime - this.lastFrameTime) / 1000;
    if (deltaTime > 0.1) deltaTime = 0.016; 
    
    this.time += deltaTime * this.speed;
    this.lastFrameTime = currentTime;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.points.length === 0) {
      this.animationId = requestAnimationFrame((t) => this.draw(t));
      return;
    }
    
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = this.color;

    // Desenha a rota perfeita
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.closePath(); 

    // === MATEMÁTICA DO FEIXE (SEM FREADAS) ===
    const beamLength = this.pathLength * 0.35; // O tamanho da "cauda" (35% da borda)
    const gapLength = this.pathLength - beamLength; // O resto fica invisível
    
    this.ctx.setLineDash([beamLength, gapLength]);
    
    // O offset roda perfeitamente em cima do tamanho calculado, zerando suavemente
    this.ctx.lineDashOffset = -(this.time * 150) % this.pathLength;
    // ==========================================

    this.ctx.stroke();
    this.ctx.setLineDash([]); // Limpeza

    this.animationId = requestAnimationFrame((time) => this.draw(time));
  }

  start() {
    this.lastFrameTime = performance.now();
    this.draw();
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// --- INTERFACE DE PROPRIEDADES ---
interface ElectricBadgeProps {
  text: string;
  opacityStyle?: MotionValue<number> | number | any;
  className?: string; 
}

// --- COMPONENTE REACT ---
export const ElectricBadge = ({ text, opacityStyle, className = "mb-8" }: ElectricBadgeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = (canvas.parentElement?.clientWidth || 300) + 20;
    canvas.height = (canvas.parentElement?.clientHeight || 40) + 20;

    const electricBorder = new SmoothElectricBorder(canvas, {
      color: "#7A6AFA", 
      displacement: 5,  
      borderOffset: 12, 
      speed: 1.2, // Velocidade ideal e suave
    });

    electricBorder.start();

    return () => {
      electricBorder.stop();
    };
  }, []);

  return (
    <motion.div 
      style={opacityStyle ? { opacity: opacityStyle } : {}} 
      className={`relative group inline-flex items-center justify-center ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#3C26F6] to-[#7A6AFA] blur-[24px] opacity-30 scale-110 -z-20 rounded-full transition-opacity duration-500 group-hover:opacity-50" />

      <div className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-b from-[#0B0428] to-black border border-white/5">
        <div className="absolute inset-0 border border-[#7A6AFA]/40 rounded-full blur-[1px] pointer-events-none" />
        <div className="absolute inset-0 border border-[#3C26F6]/30 rounded-full blur-[4px] pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none z-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <div className="absolute inset-0 rounded-full mix-blend-overlay scale-[1.05] blur-[4px] bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

        <span className="relative z-10 text-[10px] md:text-xs font-mono text-white tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_8px_rgba(122,106,250,0.8)]">
          {text}
        </span>
      </div>
    </motion.div>
  );
};
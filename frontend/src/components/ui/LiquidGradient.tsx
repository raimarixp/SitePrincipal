import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Classe TouchTexture (Otimizada)
class TouchTexture {
    size: number; width: number; height: number; maxAge: number; radius: number;
    speed: number; trail: any[]; last: any; canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null; texture: THREE.Texture | null = null;
    constructor() {
        this.size = 64; this.width = this.height = this.size; this.maxAge = 64;
        this.radius = 0.15 * this.size; this.speed = 1 / this.maxAge;
        this.trail = []; this.last = null; this.initTexture();
    }
    initTexture() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        if (this.ctx) { this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); }
        this.texture = new THREE.Texture(this.canvas);
    }
    update() {
        this.clear(); let speed = this.speed;
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i]; let f = point.force * speed * (1 - point.age / this.maxAge);
            point.x += point.vx * f; point.y += point.vy * f; point.age++;
            if (point.age > this.maxAge) { this.trail.splice(i, 1); } else { this.drawPoint(point); }
        }
        if (this.texture) this.texture.needsUpdate = true;
    }
    clear() { if (this.ctx && this.canvas) { this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); } }
    addTouch(point: { x: number; y: number }) {
        let force = 0; let vx = 0; let vy = 0; const last = this.last;
        if (last) {
            const dx = point.x - last.x; const dy = point.y - last.y;
            if (dx === 0 && dy === 0) return;
            const dd = dx * dx + dy * dy; let d = Math.sqrt(dd);
            vx = dx / d; vy = dy / d; force = Math.min(dd * 10000, 1.0);
        }
        this.last = { x: point.x, y: point.y }; this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }
    drawPoint(point: any) {
        if (!this.ctx) return;
        const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
        let intensity = 1;
        if (point.age < this.maxAge * 0.3) { intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2)); } else {
            const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7); intensity = -t * (t - 2);
        }
        intensity *= point.force; const radius = this.radius;
        // Rastro vermelho
        let color = `${255}, ${50}, ${50}`; 
        this.ctx.beginPath(); this.ctx.fillStyle = `rgba(${color}, ${intensity})`; this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2); this.ctx.fill();
    }
}

export const LiquidGradient = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 50;
    const scene = new THREE.Scene();
    
    // Fundo Preto Profundo
    scene.background = new THREE.Color(0x000000); 

    const clock = new THREE.Clock();
    const touchTexture = new TouchTexture();

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      
      // CORES AJUSTADAS PARA ANIMAÇÃO VISÍVEL
      // Cor 1: Vermelho Vibrante (Predominante)
      uColor1: { value: new THREE.Vector3(1.0, 0.1, 0.2) }, 
      
      // Cor 2: Roxo/Azul Profundo (A "outra cor" que cria o contraste para ver o movimento)
      uColor2: { value: new THREE.Vector3(0.1, 0.05, 0.3) }, 
      
      // Cor 3: Vermelho Sangue (Para profundidade)
      uColor3: { value: new THREE.Vector3(0.6, 0.0, 0.1) }, 
      
      uSpeed: { value: 0.7 }, // Aumentei a velocidade para 0.7 (era 0.3)
      uTouchTexture: { value: touchTexture.texture },
      uGrainIntensity: { value: 0.02 },
      uGradientSize: { value: 1.5 }, // Tamanho grande para o vermelho dominar
    };

    const geometry = new THREE.PlaneGeometry(camera.position.z * Math.tan((camera.fov * Math.PI) / 180 / 2) * 2 * camera.aspect, camera.position.z * Math.tan((camera.fov * Math.PI) / 180 / 2) * 2, 1, 1);
    
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv; void main() { vec3 pos = position.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.); vUv = uv; }`,
      fragmentShader: `
        uniform float uTime; uniform vec2 uResolution; 
        uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
        uniform float uSpeed; uniform sampler2D uTouchTexture; uniform float uGrainIntensity; uniform float uGradientSize;
        varying vec2 vUv;
        
        float grain(vec2 uv, float time) { 
            vec2 grainUv = uv * uResolution * 0.5; 
            return (fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0) * uGrainIntensity; 
        }
        
        void main() {
          vec2 uv = vUv;
          vec4 touchTex = texture2D(uTouchTexture, uv);
          
          // Efeito líquido do mouse
          uv.x += -(touchTex.r * 2.0 - 1.0) * 0.5 * touchTex.b;
          uv.y += -(touchTex.g * 2.0 - 1.0) * 0.5 * touchTex.b;
          
          float time = uTime * uSpeed;
          
          // Movimento mais amplo para ser visível
          vec2 c1 = vec2(0.5 + sin(time * 0.5) * 0.4, 0.5 + cos(time * 0.3) * 0.4);
          vec2 c2 = vec2(0.5 + cos(time * 0.4) * 0.4, 0.5 + sin(time * 0.5) * 0.4);
          vec2 c3 = vec2(0.5 + sin(time * 0.6) * 0.3, 0.5 + cos(time * 0.7) * 0.3);
          
          float d1 = length(uv - c1); 
          float d2 = length(uv - c2); 
          float d3 = length(uv - c3);
          
          // Ajuste de "luz" para as cores
          float i1 = smoothstep(uGradientSize, 0.0, d1); 
          float i2 = smoothstep(uGradientSize * 0.8, 0.0, d2); 
          float i3 = smoothstep(uGradientSize * 0.9, 0.0, d3);
          
          vec3 color = vec3(0.0);
          
          // Mistura: Vermelho Vibrante domina (uColor1), Roxo (uColor2) passa por trás
          color += uColor1 * i1 * 0.75; 
          color += uColor2 * i2 * 0.6; 
          color += uColor3 * i3 * 0.5; 
          
          color += grain(uv, uTime);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => { touchTexture.addTouch({ x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight }); };
    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove); window.addEventListener('resize', onResize);

    let animationId: number;
    const animate = () => {
      touchTexture.update();
      // GARANTIA DE ANIMAÇÃO: O tempo precisa passar
      material.uniforms.uTime.value = clock.getElapsedTime(); 
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black" />;
};
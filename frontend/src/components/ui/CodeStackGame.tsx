import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const CodeStackGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estados para a Interface de Usuário (UI)
  const [uiScore, setUiScore] = useState(0);
  const [uiHighScore, setUiHighScore] = useState(0);
  const [uiState, setUiState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  // Motor do Jogo protegido contra re-renderizações do React
  const engine = useRef({
    state: 'idle',
    boxes: [] as any[],
    debris: [] as any[],
    cameraY: 0,
    boxHeight: 40,
    currentWidth: 200,
    currentX: 0,
    currentY: 0,
    speed: 4,
    direction: 1,
    wordIndex: 0
  });

  // Palavras que vão aparecer nos blocos caindo
  const techWords = [
    'PERFORMANCE', 'SEGURANÇA', 'ESCALABILIDADE', 'CLEAN CODE', 
    'CLOUD NATIVE', 'UX/UI', 'ROBUSTEZ', 'API FAST', 'REACT', 'STARTUP'
  ];

  const blurple = '#3C26F6';
  const lightBlurple = '#7A6AFA';
  const danger = '#EF4444';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 500;
        // Desenha a base no meio se for a primeira vez
        if (engine.current.state === 'idle') {
          initGame();
        }
      }
    };

    const initGame = () => {
      const e = engine.current;
      e.boxes = [{
        x: canvas.width / 2,
        y: canvas.height - e.boxHeight,
        width: 200,
        height: e.boxHeight,
        color: blurple,
        isBase: true,
        text: 'WEBUILD' // A base é sempre a marca
      }];
      e.currentWidth = 200;
      e.currentX = canvas.width / 2;
      e.currentY = canvas.height - e.boxHeight * 2;
      e.speed = 4;
      e.direction = 1;
      e.cameraY = 0;
      e.debris = [];
      e.wordIndex = 0;
      setUiScore(0);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Loop de Renderização de Alta Performance (60fps)
    const draw = () => {
      const e = engine.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Movimentação da Câmera
      const targetCameraY = Math.max(0, (e.boxes.length - 6) * e.boxHeight);
      e.cameraY += (targetCameraY - e.cameraY) * 0.1; 
      ctx.translate(0, e.cameraY);

      // 1. Desenha a Torre (Blocos empilhados)
      e.boxes.forEach((box) => {
        ctx.fillStyle = box.color;
        ctx.shadowBlur = box.isBase ? 15 : 5;
        ctx.shadowColor = box.color;
        ctx.fillRect(box.x - box.width / 2, box.y, box.width, box.height);
        
        // Desenha o Texto no bloco garantindo que ele não vaze das bordas (Clipping)
        ctx.save();
        ctx.beginPath();
        ctx.rect(box.x - box.width / 2, box.y, box.width, box.height);
        ctx.clip(); // Corta o texto se o bloco for muito pequeno
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${box.isBase ? '20px' : '14px'} Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(box.text, box.x, box.y + box.height / 2);
        ctx.restore();
      });

      // 2. Desenha o Bloco Ativo e seu Texto
      if (e.state === 'playing') {
        e.currentX += e.speed * e.direction;
        
        if (e.currentX + e.currentWidth / 2 >= canvas.width || e.currentX - e.currentWidth / 2 <= 0) {
          e.direction *= -1; // Quica na parede
        }

        ctx.fillStyle = lightBlurple;
        ctx.shadowBlur = 15;
        ctx.shadowColor = lightBlurple;
        ctx.fillRect(e.currentX - e.currentWidth / 2, e.currentY, e.currentWidth, e.boxHeight);

        // Texto do bloco ativo
        const currentWord = techWords[e.wordIndex % techWords.length];
        ctx.save();
        ctx.beginPath();
        ctx.rect(e.currentX - e.currentWidth / 2, e.currentY, e.currentWidth, e.boxHeight);
        ctx.clip();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(currentWord, e.currentX, e.currentY + e.boxHeight / 2);
        ctx.restore();
      }

      // 3. Desenha os Detritos (Cortados) caindo
      e.debris.forEach((deb, index) => {
        deb.velocity += 0.5; // Força da Gravidade
        deb.y += deb.velocity;
        deb.rotation += deb.spin;

        ctx.save();
        ctx.translate(deb.x, deb.y + deb.height / 2);
        ctx.rotate(deb.rotation);
        ctx.fillStyle = danger;
        ctx.shadowBlur = 10;
        ctx.shadowColor = danger;
        ctx.globalAlpha = deb.alpha;
        ctx.fillRect(-deb.width / 2, -deb.height / 2, deb.width, deb.height);
        ctx.restore();

        // Destrói o lixo se sair da tela (Otimização)
        if (deb.y > canvas.height + e.cameraY + 100) {
          e.debris.splice(index, 1);
        }
      });

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Lógica do Clique do Usuário
    const handleInteraction = (event: Event) => {
      event.preventDefault(); // Previne zoom acidental no celular

      const e = engine.current;

      if (e.state === 'idle' || e.state === 'gameover') {
        e.state = 'playing';
        setUiState('playing');
        initGame();
        return;
      }

      const topBox = e.boxes[e.boxes.length - 1];
      if (!topBox) return; // Trava de segurança
      
      const topBoxLeft = topBox.x - topBox.width / 2;
      const topBoxRight = topBox.x + topBox.width / 2;
      
      const activeLeft = e.currentX - e.currentWidth / 2;
      const activeRight = e.currentX + e.currentWidth / 2;

      // Cálculo de Intersecção Exata (O Corte)
      const overlapLeft = Math.max(topBoxLeft, activeLeft);
      const overlapRight = Math.min(topBoxRight, activeRight);

      if (overlapRight > overlapLeft) {
        // --- SUCESSO ---
        const newWidth = overlapRight - overlapLeft;
        const diffX = Math.abs(e.currentX - topBox.x);
        const tolerance = 6; // Margem de acerto perfeito

        let finalWidth = newWidth;
        let finalX = overlapLeft + newWidth / 2;

        if (diffX > tolerance && newWidth < e.currentWidth) {
          // Cortou um pedaço do bloco
          const cutWidth = e.currentWidth - newWidth;
          const isLeftCut = activeLeft < topBoxLeft;
          const cutX = isLeftCut ? activeLeft + cutWidth / 2 : activeRight - cutWidth / 2;
          
          e.debris.push({
            x: cutX, y: e.currentY, width: cutWidth, height: e.boxHeight,
            velocity: 0, spin: (isLeftCut ? -0.1 : 0.1), alpha: 1
          });
        } else {
          // Acerto Perfeito (Encaixa magnetizado)
          finalWidth = e.currentWidth;
          finalX = topBox.x;
          e.speed += 0.3; // Bônus de velocidade por acertar no meio
        }

        // Salva o novo bloco na torre com a palavra da rodada
        e.boxes.push({
          x: finalX, y: e.currentY, width: finalWidth, height: e.boxHeight,
          color: blurple,
          text: techWords[e.wordIndex % techWords.length]
        });

        // Prepara o próximo bloco
        e.currentWidth = finalWidth;
        e.currentY -= e.boxHeight;
        e.speed += 0.1;
        e.wordIndex++; 
        
        setUiScore(prev => prev + 1);

      } else {
        // --- GAME OVER ---
        e.debris.push({
          x: e.currentX, y: e.currentY, width: e.currentWidth, height: e.boxHeight,
          velocity: 0, spin: (Math.random() - 0.5) * 0.2, alpha: 1
        });
        e.state = 'gameover';
        setUiState('gameover');
        setUiHighScore(prev => Math.max(prev, uiScore));
      }
    };

    canvas.addEventListener('mousedown', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleInteraction);
      canvas.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationId);
    };
  }, []); // Array vazia = o motor renderiza uma única vez na memória e não zera a tela

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#0B0428] border border-white/10 shadow-[0_0_40px_rgba(60,38,246,0.2)]">
      
      {/* HUD (Cabeçalho do Jogo) */}
      <div className="absolute top-6 left-6 right-6 flex justify-between z-10 pointer-events-none">
        <div>
          <p className="text-xs font-mono text-[#7A6AFA] tracking-widest uppercase">Camadas</p>
          <p className="text-3xl font-black text-white">{uiScore}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase">Recorde</p>
          <p className="text-xl font-bold text-neutral-300">{uiHighScore}</p>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-[500px] cursor-crosshair touch-none block" />

      {/* Menus Flutuantes (Início e Morte) */}
      {uiState !== 'playing' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto"
          >
            {uiState === 'gameover' && (
              <h3 className="text-3xl font-black text-white italic mb-2">ESTRUTURA INSTÁVEL</h3>
            )}
            <h2 className="text-lg text-neutral-300 mb-8 font-light max-w-sm">
              {uiState === 'idle' 
                ? 'Construa uma arquitetura perfeita.' 
                : `A operação falhou porque a base ficou muito estreita.`}
            </h2>
            <button 
              onClick={() => {
                // Ao clicar aqui, nós forçamos o disparo de um evento no canvas para iniciar o jogo
                if (canvasRef.current) {
                  const clickEvent = new MouseEvent('mousedown');
                  canvasRef.current.dispatchEvent(clickEvent);
                }
              }}
              className="px-8 py-3 rounded-full bg-[#3C26F6] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(60,38,246,0.5)] hover:bg-[#2D18E5] transition-colors"
            >
              {uiState === 'idle' ? 'Iniciar Simulação' : 'Tentar Novamente'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
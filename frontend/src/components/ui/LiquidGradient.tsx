import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Color } from 'three';

// Shader customizado para o efeito líquido elétrico
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Cria ondas complexas
    float wave1 = sin(uv.x * 10.0 + uTime * 0.5 + uv.y * 5.0) * 0.2;
    float wave2 = sin(uv.y * 12.0 + uTime * 0.8 + uv.x * 4.0) * 0.2;
    float wave3 = sin((uv.x + uv.y) * 8.0 + uTime * 0.3) * 0.1;
    
    float noise = wave1 + wave2 + wave3;
    
    // Mistura as cores baseada no movimento (Azul Relâmpago + Preto)
    vec3 color = mix(uColor1, uColor2, uv.y + noise);
    color = mix(color, uColor3, sin(uv.x + uTime * 0.2) * 0.5 + 0.5);
    
    // Adiciona um brilho "elétrico" nas cristas das ondas
    float electric = smoothstep(0.4, 0.42, noise + 0.2) - smoothstep(0.42, 0.45, noise + 0.2);
    color += vec3(0.5, 0.8, 1.0) * electric * 0.5;

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
  
  // Cores: Preto, Azul Relâmpago (#0077FF) e Azul Profundo
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new Color('#000000') }, // Preto (Fundo)
      uColor2: { value: new Color('#001133') }, // Azul muito escuro
      uColor3: { value: new Color('#0077FF') }, // Azul Relâmpago (Destaque)
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      // @ts-ignore
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
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
    <div className="absolute inset-0 -z-10 w-full h-full opacity-60">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <GradientMesh />
      </Canvas>
    </div>
  );
};
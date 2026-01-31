import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumentamos o limite para não dar aviso, já que o vendor vai ficar grandinho
    chunkSizeWarningLimit: 2000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            
            // 1. Firebase (Gigante e isolado)
            if (id.includes('firebase')) {
              return 'firebase';
            }

            // 2. Three.js (Usado no gradiente, muito pesado)
            if (id.includes('three')) {
              return 'three';
            }

            // 3. Todo o resto (React, Framer Motion, Ícones, etc)
            // Mantemos juntos para evitar erros de importação/ordem
            return 'vendor';
          }
        },
      },
    },
  },
})
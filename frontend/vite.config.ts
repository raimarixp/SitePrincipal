import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite do aviso para 1000kb (opcional, só para sumir o aviso)
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa o Firebase em um arquivo isolado (ele é pesado)
          if (id.includes('firebase')) {
            return 'firebase';
          }
          // Separa as bibliotecas do React e outras dependências
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
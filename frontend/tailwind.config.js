/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === NOVA PALETA DEFINITIVA ===
        primary: {
          DEFAULT: '#3C26F6', // O novo "Blurple" (Ação, Destaque, Links)
          hover: '#2D18E5',   // Tom profundo para hover
          light: '#7A6AFA',   // Tom claro para brilhos e efeitos elétricos
        },
        background: {
          DEFAULT: '#000000', // Preto Absoluto
          card: '#111111',    // Cards e seções
        },
        secondary: {
          DEFAULT: '#FFFFFF', // Texto Principal
        },
        tertiary: {
          DEFAULT: '#D1D3D4', // Cinza Concreto (Subtítulos)
          muted: '#2A2A2A',   // Bordas sutis
        },
        // Compatibilidade e Auxiliares
        dark: '#000000',
        light: '#FFFFFF',
        danger: '#EF4444',
      },
      fontFamily: {
        // Agora o site inteiro usa Poppins por padrão
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        // Gradiente profundo ajustado para o novo tom
        'hero-pattern': "linear-gradient(to bottom, #000000, #0B0428)", 
      },
      boxShadow: {
        // Sombra Neon atualizada para o novo Blurple (60, 38, 246)
        'neon': '0 0 15px rgba(60, 38, 246, 0.4)',
        'neon-strong': '0 0 25px rgba(60, 38, 246, 0.6)',
      }
    },
  },
  plugins: [],
}
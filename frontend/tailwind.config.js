/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === NOVA PALETA ===
        primary: {
          DEFAULT: '#0077FF', // Azul Relâmpago (Ação, Destaque, Links)
          hover: '#0055CC',   // Um tom mais escuro para o hover do botão
          light: '#3392FF',   // Azul mais claro para brilhos
        },
        background: {
          DEFAULT: '#000000', // Preto Absoluto (Fundo do Site)
          card: '#111111',    // Preto levemente mais claro (Cards)
        },
        secondary: {
          DEFAULT: '#FFFFFF', // Branco Puro (Texto Principal)
        },
        tertiary: {
          DEFAULT: '#D1D3D4', // Cinza Concreto (Detalhes e Bordas)
        },
        // Compatibilidade
        dark: '#000000',
        light: '#FFFFFF',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        // Gradiente sutil preto -> azul muito escuro no final
        'hero-pattern': "linear-gradient(to bottom, #000000, #050505)", 
      },
      boxShadow: {
        // Sombra azul neon para botões/cards
        'neon': '0 0 10px rgba(0, 119, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
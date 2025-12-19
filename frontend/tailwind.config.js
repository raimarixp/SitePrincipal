/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E63946', // Vermelho Vibrante (Estilo Uncode)
          hover: '#D62828',   // Vermelho mais escuro para hover
        },
        secondary: {
          DEFAULT: '#1D3557', // Azul Escuro Profundo (para contraste se precisar)
          hover: '#457B9D',
        },
        dark: '#111827',      // Preto "suave" para fundos escuros
        light: '#F8F9FA',     // Cinza quase branco para fundos claros
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Vamos configurar isso no CSS já já
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      }
    },
  },
  plugins: [],
}
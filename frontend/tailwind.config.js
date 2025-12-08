/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Breakpoint extra solicitado
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Azul profissional
          hover: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#7c3aed', // Roxo para CTAs
          hover: '#6d28d9',
        },
        accent: '#10b981',    // Verde sucesso
        neutral: {
          50: '#f9fafb',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Recomendação profissional
      }
    },
  },
  plugins: [],
}
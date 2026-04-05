/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'aurora-1': 'aurora-1 25s ease-in-out infinite',
        'aurora-2': 'aurora-2 30s ease-in-out infinite reverse',
        'aurora-3': 'aurora-3 20s ease-in-out infinite',
      },
      keyframes: {
        'aurora-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(10%, 15%) scale(1.1)' },
          '66%': { transform: 'translate(-15%, 5%) scale(0.95)' },
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.05)' },
          '33%': { transform: 'translate(-10%, -15%) scale(0.9)' },
          '66%': { transform: 'translate(20%, 5%) scale(1.15)' },
        },
        'aurora-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(0.95)' },
          '33%': { transform: 'translate(5%, 20%) scale(1.1)' },
          '66%': { transform: 'translate(15%, -15%) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}


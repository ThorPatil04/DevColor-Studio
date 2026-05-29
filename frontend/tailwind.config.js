/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
          darkest: '#020617',
          accent: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shuffle': 'shuffle 0.4s ease-in-out',
      },
      keyframes: {
        shuffle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}

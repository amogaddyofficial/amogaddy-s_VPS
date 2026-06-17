/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jupiter: {
          50: '#fff9ed',
          100: '#ffefd4',
          200: '#ffdca8',
          300: '#ffc171',
          400: '#ff9c3a',
          500: '#f0a04b', // Base Jupiter Orange
          600: '#d97d1e',
          700: '#b45d1b',
          800: '#914a1d',
          900: '#753e1b',
          950: '#401e0b',
        },
        space: {
          900: '#0a0a0b',
          950: '#050506',
        }
      },
    },
  },
  plugins: [],
}

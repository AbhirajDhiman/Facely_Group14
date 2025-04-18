/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        show: {
          '0%, 49.99%': { opacity: 0 },
          '50%, 100%': { opacity: 1 }
        }
      },
      animation: {
        show: 'show 0.6s'
      }
    }
  },
  plugins: []
};

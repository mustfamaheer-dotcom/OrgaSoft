/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./views/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./admin/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        orga: {
          orange: '#df4d21',
          blue: '#0f639e',
          green: '#0a743c',
          lightblue: '#3292ca',
          offwhite: '#f1f5f0',
          terracotta: '#c19382',
          teal: '#82b0aa',
          red: '#aa4832',
        },
        blue: {
          900: '#0f639e',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

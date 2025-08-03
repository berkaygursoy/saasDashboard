/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1E293B', // slate-800
          200: '#0F172A', // slate-900
          300: '#020617', // slate-950
        }
      }
    },
  },
  plugins: [],
};

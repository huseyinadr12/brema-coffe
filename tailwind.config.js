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
        'brand-black': '#080706',
        'brand-dark-roast': '#16100C',
        'brand-espresso': '#20150F',
        'brand-brown': '#6E4228',
        'brand-caramel': '#C6955B',
        'brand-crema': '#E8D8C0',
        'brand-warm-white': '#F4EFE8',
        'brand-gold': '#D4A373',
        'brand-bronze': '#A87C4F',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Instrument Serif"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', '"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', '"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
        display: ['Syne', '"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.22em',
        ultra: '0.35em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
}

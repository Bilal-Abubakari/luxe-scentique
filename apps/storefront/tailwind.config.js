/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FAF5DC',
          100: '#F5EBB9',
          200: '#ECD874',
          300: '#E2C44F',
          400: '#D4AF37',
          500: '#B8962E',
          600: '#9B7D26',
          700: '#7F641E',
          800: '#624B16',
          900: '#46330E',
        },
        onyx: {
          DEFAULT: '#0F0F0F',
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#3d3d3d',
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#0F0F0F',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FFFDF9',
          100: '#FAF7F2',
          200: '#F2EAD9',
          300: '#E8D9BE',
          400: '#DEC8A3',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'gold': '0 0 0 1px #D4AF37',
        'gold-md': '0 4px 14px 0 rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 30px 0 rgba(212, 175, 55, 0.35)',
        'onyx': '0 4px 24px 0 rgba(15, 15, 15, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(15,15,15,0.3) 0%, rgba(15,15,15,0.7) 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(15,15,15,0.8) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

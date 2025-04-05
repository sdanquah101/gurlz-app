/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#003139',
          DEFAULT: '#005d6c',
          light: '#00899f',
        },
        secondary: {
          dark: '#FEACC6',
          DEFAULT: '#ffdee9',
          light: '#ffffff',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'hide': 'hide 100ms ease-in',
        'slideIn': 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'swipeOut': 'swipeOut 100ms ease-out',
      },
      keyframes: {
        hide: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        slideIn: {
          from: { transform: 'translateX(calc(100% + 1rem))' },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + 1rem))' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};
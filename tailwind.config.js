/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
<<<<<<< HEAD
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Spotify-inspired colors
        spotify: {
          green: '#1DB954',
          'green-light': '#1ed760',
          'green-dark': '#1aa34a',
          black: '#121212',
          'dark-gray': '#181818',
          'medium-gray': '#282828',
          'light-gray': '#404040',
          'text-gray': '#b3b3b3',
          'text-white': '#ffffff',
          'card-bg': '#181818',
          'hover-bg': '#282828',
          'active-bg': '#2a2a2a',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#1DB954', // Spotify green
          600: '#1aa34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
=======
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        slate: {
<<<<<<< HEAD
          850: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Circular', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Circular', 'Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
=======
          850: '#1e293b', // Custom dark shade
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
<<<<<<< HEAD
        'spotify-gradient': 'linear-gradient(180deg, rgba(29,185,84,0.3) 0%, #121212 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
<<<<<<< HEAD
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'equalizer': 'equalizer 0.8s ease-in-out infinite',
=======
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
<<<<<<< HEAD
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(29,185,84,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(29,185,84,0.6)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        equalizer: {
          '0%, 100%': { height: '10%' },
          '50%': { height: '100%' },
        },
      },
      transitionTimingFunction: {
        'spotify': 'cubic-bezier(0.3, 0, 0, 1)',
      },
      boxShadow: {
        'spotify': '0 8px 24px rgba(0,0,0,.5)',
        'spotify-lg': '0 16px 48px rgba(0,0,0,.7)',
        'glow-green': '0 0 30px rgba(29,185,84,0.4)',
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      },
    },
  },
  plugins: [],
}

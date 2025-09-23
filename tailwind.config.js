/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // E-CTRL Brand Colors (orange, blue, black)
        brand: {
          orange: '#F97316', // orange-500
          'orange-dark': '#EA580C', // orange-600
          'orange-light': '#FED7AA', // orange-200
          blue: '#2563EB', // blue-600
          'blue-dark': '#1D4ED8', // blue-700
          'blue-light': '#DBEAFE', // blue-100
          black: '#0F172A', // slate-900
          'black-light': '#1E293B', // slate-800
        },
        // Light mode (default)
        background: '#ffffff',
        foreground: '#0F172A', // slate-900 (brand black)
        muted: {
          DEFAULT: '#F8FAFC', // slate-50
          foreground: '#64748B', // slate-500
        },
        accent: {
          DEFAULT: '#F97316', // brand orange
          foreground: '#ffffff',
        },
        border: '#E2E8F0', // slate-200
        input: '#F1F5F9', // slate-100
        // Dark mode tokens (scaffolded for future)
        dark: {
          background: '#0F172A', // brand black
          foreground: '#F8FAFC', // slate-50
          muted: {
            DEFAULT: '#1E293B', // slate-800
            foreground: '#94A3B8', // slate-400
          },
          accent: {
            DEFAULT: '#F97316', // brand orange
            foreground: '#F8FAFC',
          },
          border: '#334155', // slate-700
          input: '#1E293B', // slate-800
        }
      },
      fontFamily: {
        sans: ['General Sans', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        // 8pt scale
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
    },
  },
  plugins: [],
}

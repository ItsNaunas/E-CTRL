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
        // Light mode (default)
        background: '#ffffff',
        foreground: '#0F172A', // slate-900
        muted: {
          DEFAULT: '#F8FAFC', // slate-50
          foreground: '#64748B', // slate-500
        },
        accent: {
          DEFAULT: '#2563EB', // blue-600
          foreground: '#ffffff',
        },
        border: '#E2E8F0', // slate-200
        input: '#F1F5F9', // slate-100
        // Dark mode tokens (scaffolded for future)
        dark: {
          background: '#020617', // slate-950
          foreground: '#F8FAFC', // slate-50
          muted: {
            DEFAULT: '#1E293B', // slate-800
            foreground: '#94A3B8', // slate-400
          },
          accent: {
            DEFAULT: '#3B82F6', // blue-500
            foreground: '#F8FAFC',
          },
          border: '#334155', // slate-700
          input: '#1E293B', // slate-800
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // 8pt scale
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

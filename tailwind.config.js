/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#0a0e1a',
        'dark-secondary': '#1a1f2e',
        'dark-card': '#151923',
        'accent-red': '#dc2626',
        'accent-red-dark': '#b91c1c',
        'light-blue': '#e0f2fe',
        'pale-blue': '#dbeafe',
        'deep-blue': '#1e3a8a',
        'medium-blue': '#3b82f6',
        'navy-dark': '#061652',
        'card-dark': '#1c2242',
        'pale-yellow': '#fef9c3',
        'label-green': '#10b981',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #0a0e1a, #111827, #0a0e1a)',
        'red-glow': 'radial-gradient(circle, rgba(220, 38, 38, 0.2), transparent)',
        'white-to-blue': 'linear-gradient(to bottom, #ffffff, #e0f2fe)',
        'blue-horizontal': 'linear-gradient(to right, #1e3a8a, #3b82f6)',
        'blue-radial': 'radial-gradient(circle, #3b82f6, transparent)',
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(220, 38, 38, 0.5)',
        'red-glow-lg': '0 0 40px rgba(220, 38, 38, 0.6)',
        'yellow-glow': '0 0 15px rgba(254, 249, 195, 0.6)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'blue-glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.5)',
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(220, 38, 38, 0.8)' },
        },
      },
      fontFamily: {
        'title': ['HYYaKuHeiW', 'Noto Sans JP', 'sans-serif'],
        'subtitle': ['Adobe Heiti Std', 'Hiragino Sans', 'sans-serif'],
      },
      spacing: {
        '7.5': '30px',
      },
    },
  },
  plugins: [],
};

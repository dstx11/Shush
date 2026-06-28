/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shush: {
          bg: '#050509',
          surface: '#0B0B10',
          surface2: '#111117',
          purple: '#4B16B8',
          purpleDark: '#25085F',
          purpleGlow: '#6E32FF',
          text: '#F2F2F5',
          muted: '#A7A2BD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 48px rgba(110, 50, 255, .28)',
      },
    },
  },
  plugins: [],
};

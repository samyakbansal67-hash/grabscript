/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './pages/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"Geist"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { 900: '#1a1530', 700: '#2d2654', 500: '#5a527e', 300: '#9a93b8' },
        cream: '#fbf8f4',
        paper: '#f6f1ea',
        indigo: { soft: '#7b6cf2' },
        violet: { soft: '#a17af0' },
        sky: { soft: '#7cb8ff' },
        blush: '#ffb3c8',
        peach: '#ffd6b3',
      },
    },
  },
  plugins: [],
}

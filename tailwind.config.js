/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0C0C0C',
        ink: '#D7E2EA',
        muted: 'rgba(215, 226, 234, 0.6)',
        line: 'rgba(255, 255, 255, 0.08)',
        panel: 'rgba(14, 19, 23, 0.84)',
        accent: '#F39419',
      },
      fontFamily: {
        sans: ['"Urbanist Variable"', 'Urbanist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.65, 0, 0.35, 1)',
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

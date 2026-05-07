/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#050B1F',
          midnight: '#0A1430',
          slate: '#0F1A38',
          accent: '#10B981',
          accentDim: '#059669',
          gold: '#F5C04A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(16, 185, 129, 0.45)',
        card: '0 10px 40px -10px rgba(2, 6, 23, 0.7)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.18), transparent 60%), linear-gradient(to bottom, #050B1F 0%, #050B1F 100%)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      boxShadow: {
        glass:
          '0 1px 0 rgba(255,255,255,0.55) inset, 0 0 0 1px rgba(0,0,0,0.06) inset, 0 12px 30px rgba(0,0,0,0.10)',
        'glass-hover':
          '0 1px 0 rgba(255,255,255,0.65) inset, 0 0 0 1px rgba(0,0,0,0.08) inset, 0 18px 42px rgba(0,0,0,0.14)',
      },
      backdropBlur: {
        '2xl': '40px',
      },
      colors: {
        ink: {
          950: '#0b0c0f',
        },
      },
    },
  },
  plugins: [],
}

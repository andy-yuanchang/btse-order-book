/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#131B29',
        default: '#F0F4F8',
        'quote-head': '#8698aa',
        'buy-quote': '#00b15d',
        'sell-quote': '#FF5B5A',
        'quote-hover': '#1E3059',
        'buy-quote-size': 'rgba(16, 186, 104, 0.12)',
        'sell-quote-size': 'rgba(255, 90, 90, 0.12)',
        'flash-green': 'rgba(0, 177, 93, 0.5)',
        'flash-red': 'rgba(255, 91, 90, 0.5)'
      },
      keyframes: {
        highlight: {
          '0%': { backgroundColor: 'rgba(0, 177, 93, 0.5)' },
          '100%': { backgroundColor: 'transparent' }
        },
        'sell-highlight': {
          '0%': { backgroundColor: 'rgba(255, 91, 90, 0.5)' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        'buy-highlight': 'highlight 1s ease',
        'sell-highlight': 'sell-highlight 1s ease'
      }
    }
  },
  plugins: []
}

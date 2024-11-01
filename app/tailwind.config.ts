import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'gt-expanded': ['GT-America-Expanded-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium': ['GT-America-Standard-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium-italic': ['GT-America-Standard-Medium-Italic', 'Arial', 'sans-serif'],
        'gt-standard': ['GT-America-Standard-Regular', 'Arial', 'sans-serif'],
        'gt-standard-italic': ['GT-America-Standard-Regular-Italic', 'Arial', 'sans-serif'],
        'gt-light': ['GT-America-Standard-Light', 'Arial', 'sans-serif'],
        'gt-light-italic': ['GT-America-Standard-Light-Italic', 'Arial', 'sans-serif'],
      },
      theme: {
        bekk: {
          rebell: '#dfff26',
          natt: '#1f1f1f',
          dag: '#f8f8f8',
          'natt-lys': '#2E2E2E',
          base: 'var(--background-color-base)',
          accent: 'var(--background-color-accent)',
          'text-color': 'var(--text-color-base)',
          'text-color-accent': 'var(--text-color-accent)',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config

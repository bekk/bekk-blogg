import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'envelope-beige': '#E0C190',
        'postcard-beige': '#F7F3EE',
        'light-gray': '#e3e3e3',
      },
      textColor: {
        base: '#000000',
        'reindeer-brown': '#714319',
        'santa-red': '#D0332E',
        'christmas-tree-green': '#2F7346',
      },
      fontFamily: {
        'gt-expanded': ['GT-America-Expanded-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium': ['GT-America-Standard-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium-italic': ['GT-America-Standard-Medium-Italic', 'Arial', 'sans-serif'],
        'gt-standard': ['GT-America-Standard-Regular', 'Arial', 'sans-serif'],
        'gt-standard-italic': ['GT-America-Standard-Regular-Italic', 'Arial', 'sans-serif'],
        'gt-light': ['GT-America-Standard-Light', 'Arial', 'sans-serif'],
        'gt-light-italic': ['GT-America-Standard-Light-Italic', 'Arial', 'sans-serif'],
        delicious: ['Delicious Handrawn', 'cursive'],
      },

      fontSize: {
        'display-desktop': '48px',
        'headline-desktop': '40px',
        'leading-desktop': '28px',
        'subtitle-desktop': '22px',
        'body-desktop': '18px',
        'action-desktop': '14px',

        'display-mobile': '36px',
        'headline-mobile': '30px',
        'leading-mobile': '22px',
        'subtitle-mobile': '18px',
        'body-mobile': '16px',
        'action-mobile': '14px',
      },
      screens: {
        sm: '640px',
        md: '900px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '14': '14px',
      },
      height: {
        '21.4': '85.6px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        'bekk-night': '#1f1f1f',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [typography, animate],
} satisfies Config

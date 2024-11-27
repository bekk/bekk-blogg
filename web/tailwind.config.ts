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
        'postcard-beige': '#F7F3EE',
        'santa-red': '#D0332E',
        'christmas-tree-green': '#2F7346',
        'ruben-red': '#A01A1A',
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
        'large-desktop': '96px',
        'display-desktop': '56px',
        'headline-desktop': '48px',
        'leading-desktop': '32px',
        'subtitle-desktop': '24px',
        'body-desktop': '20px',
        'action-desktop': '16px',
        'display-mobile': '32px',
        'headline-mobile': '26px',
        'leading-mobile': '22px',
        'subtitle-mobile': '20px',
        'body-mobile': '18px',
        'action-mobile': '12px',
      },
      screens: {
        sm: '640px',
        md: '900px',
        lg: '1024px',
        '2lg': '1130px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '14': '14px',
        '30': '30px',
      },
      borderColor: {
        'reindeer-brown': '#714319',
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

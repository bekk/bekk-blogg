import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor:{
        'postcard-beige': '#F7F3EE',
      },
      textColor:{
        'base': '#000000',
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
        'delicious': ['Delicious Handrawn', 'cursive'],
      },
      fontSize: {
        'display-desktop': '56px',
        'headline-desktop': '48px',
        'leading-desktop': '32px',
        'subtitle-desktop': '24px',
        'body-desktop': '20px',
        'action-desktop': '16px',
        'display-mobile': '40px',
        'headline-mobile': '32px',
        'leading-mobile': '24px',
        'subtitle-mobile': '20px',
        'body-mobile': '16px',
        'action-mobile': '12px',
      },
      screens: {
        sm: '640px',
        md: '900px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
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
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
} satisfies Config

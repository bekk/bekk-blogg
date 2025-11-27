import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import { PluginAPI } from 'tailwindcss/types/config'

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '12.5%': { transform: 'rotate(-2deg)' },
          '37.5%': { transform: 'rotate(2deg)' },
          '62.5%': { transform: 'rotate(-2deg)' },
          '87.5%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out',
      },
      backgroundColor: {
        'envelope-beige': '#E0C190',
        'postcard-beige': '#F7F3EE',
        'light-gray': '#e3e3e3',
        'christmas-tree-green': '#2F7346',
        'dark-green': '#164125',
        'soft-pink': '#FDD0D8',
        'mid-green': '#32432D',
        'red-berry': '#A7060E',
        'soft-green': '#AEB7AB',
        'soft-red': '#ED7E87',
        'dark-red': '#6D0D22',
      },
      textColor: {
        base: '#000000',
        'reindeer-brown': '#714319',
        'postcard-beige': '#F7F3EE',
        'santa-red': '#D0332E',
        'christmas-tree-green': '#2F7346',
        'ruben-red': '#A01A1A',
        'light-brown': '#FFEBBF',
        'dark-brown': '#413009',
        'red-berry': '#A7060E',
        'soft-pink': '#FDD0D8',
        'soft-green': '#AEB7AB',
        'soft-red': '#ED7E87',
        'dark-red': '#6D0D22',
      },
      fontFamily: {
        'gt-expanded': ['GT-America-Expanded-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium': ['GT-America-Standard-Medium', 'Arial', 'sans-serif'],
        'gt-standard-medium-italic': ['GT-America-Standard-Medium-Italic', 'Arial', 'sans-serif'],
        'gt-standard': ['GT-America-Standard-Regular', 'Arial', 'sans-serif'],
        'gt-standard-italic': ['GT-America-Standard-Regular-Italic', 'Arial', 'sans-serif'],
        'gt-light': ['GT-America-Standard-Light', 'Arial', 'sans-serif'],
        'gt-light-italic': ['GT-America-Standard-Light-Italic', 'Arial', 'sans-serif'],
        'source-serif-bold': ['Source Serif Pro Bold'],
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
        '2sm': '832px',
        md: '900px',
        lg: '1024px',
        '2lg': '1130px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderWidth: {
        '6': '6px',
        '14': '14px',
        '30': '30px',
        '40': '40px',
        DEFAULT: '1px',
      },
      borderColor: {
        'reindeer-brown': '#714319',
        'christmas-tree-green': '#2F7346',
        'santa-red': '#D0332E',
        'red-berry': '#A7060E',
        'mid-green': '#32432D',
      },
      ringColor: {
        'red-berry': '#A7060E',
      },
      placeholderColor: {
        'red-berry': '#A7060E',
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
        'reindeer-brown': '#714319',
        'red-berry': '#A7060E',
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
        background: 'hsl(var(--background))',
      },
    },
  },
  plugins: [
    typography,
    animate,
    function ({ addComponents }: PluginAPI) {
      addComponents({
        '.stamp-border': {
          position: 'relative',
          isolation: 'isolate',
          padding: '0',
          '--border-thickness': 'calc(var(--border-radius) * 1.5)',
        },

        '.stamp-border::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          zIndex: '-1',

          backgroundImage:
            'radial-gradient(var(--border-radius), transparent 100%, var(--border-color)), linear-gradient(var(--border-color) 0 0)',
          backgroundRepeat: 'round, no-repeat',
          backgroundPosition: 'calc(var(--border-radius) * -1.5) calc(var(--border-radius) * -1.5), 50%',
          backgroundSize:
            'calc(var(--border-radius) * 3) calc(var(--border-radius) * 3), calc(100% - var(--border-radius) * 3) calc(100% - var(--border-radius) * 3)',
          transform: 'rotate(var(--border-rotation, 0deg))',
          transformOrigin: 'center center',
        },

        '.stamp-border::after': {
          content: '""',
          position: 'absolute',
          inset: 'var(--border-thickness)',

          zIndex: '-1',
          background: 'var(--stamp-bg)',
          transform: 'rotate(var(--border-rotation, 0deg))',
          transformOrigin: 'center center',
        },
      })
    },
  ],
} satisfies Config

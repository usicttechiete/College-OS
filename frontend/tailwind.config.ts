import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'
import tokens from './tokens.json'

const spacing = tokens.spacing.scale.reduce<Record<string, string>>((acc, value) => {
  acc[value.toString()] = `${value}px`
  return acc
}, {})

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        neutral: {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          500: 'var(--color-neutral-500)',
          700: 'var(--color-neutral-700)',
        },
        surface: {
          flat: 'var(--surface-flat)',
          raised: 'var(--surface-raised)',
          floating: 'var(--surface-floating)',
        },
      },
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        pill: tokens.radius.pill,
      },
      spacing,
      fontFamily: {
        sans: tokens.typography.fontFamily.split(',').map((font) => font.trim().replace(/^'|'$/g, '')),
      },
      fontSize: {
        xs: ['12px', tokens.typography.lineHeights.relaxed],
        sm: ['14px', tokens.typography.lineHeights.relaxed],
        base: ['16px', tokens.typography.lineHeights.relaxed],
        lg: ['18px', tokens.typography.lineHeights.base],
        xl: ['20px', tokens.typography.lineHeights.base],
        '2xl': ['24px', tokens.typography.lineHeights.tight],
        '3xl': ['32px', tokens.typography.lineHeights.tight],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        strong: 'var(--shadow-strong)',
        colored: 'var(--shadow-colored)',
      },
      transitionTimingFunction: {
        'ease-out-150': tokens.motion['ease-out-150'],
        'ease-in-out-200': tokens.motion['ease-in-out-200'],
      },
    },
    screens: {
      sm: `${tokens.breakpoints.sm}px`,
      md: `${tokens.breakpoints.md}px`,
      lg: `${tokens.breakpoints.lg}px`,
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('dark', '.dark &')
      addVariant('hocus', ['&:hover', '&:focus-visible'])
    }),
  ],
} satisfies Config

export default config

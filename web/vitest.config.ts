import { defineConfig } from 'vitest/config'

// Egen config for å slippe React Router-pluginen fra vite.config.ts i testene
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['app/**/*.test.{ts,tsx}', 'utils/**/*.test.{ts,tsx}'],
    // Samme tidssone som serverne på Vercel
    env: { TZ: 'UTC' },
  },
})

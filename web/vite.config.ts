import { reactRouter } from '@react-router/dev/vite'
import { vercelPreset } from '@vercel/remix/vite'
import { defineConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    vercelPreset(),
    reactRouter(),
    tsconfigPaths(),
    cjsInterop({
      dependencies: ['sanity-algolia'],
    }),
  ],
})

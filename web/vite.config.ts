import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    cjsInterop({
      dependencies: ['sanity-algolia'],
    }),
    tailwindcss(),
  ],
})

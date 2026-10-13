import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    reactRouter(),
    cjsInterop({
      dependencies: ['sanity-algolia'],
    }),
    tailwindcss(),
  ],
})

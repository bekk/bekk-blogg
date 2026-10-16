import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    // Uten entries finner Vite avhengighetene først når de lastes, og må da laste siden på nytt
    // midt i et besøk. Det gjelder særlig Studioet, som importeres dynamisk.
    entries: ['./app/**/*.tsx', './studio/Studio.tsx'],
  },
  plugins: [
    reactRouter(),
    cjsInterop({
      dependencies: ['sanity-algolia'],
    }),
    tailwindcss(),
  ],
})

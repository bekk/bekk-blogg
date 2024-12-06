import { vitePlugin as remix } from '@remix-run/dev'
import { vercelPreset } from '@vercel/remix/vite'
import { defineConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_singleFetch: true,
        v3_relativeSplatPath: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_throwAbortReason: true,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
    cjsInterop({
      dependencies: ['sanity-algolia'],
    }),
  ],
  resolve: {
    alias: {
      'sanity-algolia': 'sanity-algolia/dist/sanity-algolia.esm.js',
    },
  },
})

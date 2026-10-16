import {createAuthStore, defineConfig, SchemaTypeDefinition} from 'sanity'
import {media} from 'sanity-plugin-media'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {codeInput} from '@sanity/code-input'
import {nbNOLocale} from '@sanity/locale-nb-no'
import {table} from '@sanity/table'
import {visionTool} from '@sanity/vision'

import {RequestReviewAction} from './actions/requestReview'
import {assistPlugin} from './assist'
import schemas from './schemas/schema'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {structure} from './structure'

// Define your schema types explicitly
const schemaTypes = schemas as SchemaTypeDefinition[]

// Create the configuration with explicit typing
const projectId = 'ah2n1vfr'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'bekk-blogg-prod'

const config = defineConfig({
  basePath: '/',
  name: 'default',
  title: 'Bekk Christmas',
  projectId,
  dataset,

  plugins: [
    nbNOLocale(),
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    media(),
    codeInput(),
    table(),
    assistPlugin(),
    presentationTool({
      devMode: process.env.NODE_ENV !== 'production',
      previewUrl: {
        previewMode: {
          enable: '/resource/preview',
          shareAccess: true,
        },
        origin: process.env.SANITY_STUDIO_FRONTEND_URL,
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/post/:year/:date/:slug',
            resolve: (ctx) => ({
              filter: '_type == "post" && slug.current == $slug',
              params: {
                slug: ctx.params.slug,
              },
            }),
          },
        ]),
        locations: {
          // TODO: Add support for authors and categories
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
              availableFrom: 'availableFrom',
            },
            resolve: (doc) => {
              // `availableFrom` er en dato (YYYY-MM-DD). Les den som tekst, så
              // tidssonen til den som redigerer ikke gir feil dag.
              const [year, , day] = (doc?.availableFrom ?? '').split('-')
              return {
                locations: [
                  {
                    title: doc?.title || 'Untitled',
                    href: `/post/${year}/${day}/${doc?.slug}`,
                  },
                  {
                    title: 'Dag',
                    href: `/post/${year}/${day}`,
                  },
                ],
              }
            },
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, {schemaType}) =>
      schemaType === 'post' ? [...prev, RequestReviewAction] : prev,
  },
  auth: createAuthStore({
    projectId,
    dataset,
    // `mode` ble fjernet i Studio v6 — å erstatte de innebygde providerne
    // er nå standardoppførselen for en statisk providers-array.
    providers: [
      {
        name: 'saml',
        logo: 'https://www.bekk.no/favicon.ico',
        title: 'Bekk Login',
        url: 'https://api.sanity.io/v2021-10-01/auth/saml/login/46187778',
      },
    ],
  }),
})

export default config

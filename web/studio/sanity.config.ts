import { defineConfig, SchemaTypeDefinition } from 'sanity'
import { media } from 'sanity-plugin-media'
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { codeInput } from '@sanity/code-input'
import { nbNOLocale } from '@sanity/locale-nb-no'
import { table } from '@sanity/table'
import { visionTool } from '@sanity/vision'

import { RequestReviewAction } from './actions/requestReview'
import { assistPlugin } from './assist'
import schemas from './schemas/schema'
import { defaultDocumentNode } from './structure/defaultDocumentNode'
import { structure } from './structure'

// Define your schema types explicitly
const schemaTypes = schemas as SchemaTypeDefinition[]

// Studioet kjører i nettleseren, der `process.env` ikke finnes
const projectId = 'ah2n1vfr'
const dataset = 'bekk-blogg-prod'

const config = defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Bekk Christmas',
  projectId,
  dataset,

  plugins: [
    nbNOLocale(),
    structureTool({ structure, defaultDocumentNode }),
    visionTool(),
    media(),
    codeInput(),
    table(),
    assistPlugin(),
    presentationTool({
      devMode: import.meta.env.DEV,
      previewUrl: {
        previewMode: {
          enable: '/resource/preview',
          shareAccess: true,
        },
        // Studioet og nettsiden har samme origin, så `origin` trengs ikke
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
    actions: (prev, { schemaType }) => (schemaType === 'post' ? [...prev, RequestReviewAction] : prev),
  },
  auth: {
    // En statisk providers-array erstatter de innebygde providerne
    providers: [
      {
        name: 'saml',
        logo: 'https://www.bekk.no/favicon.ico',
        title: 'Bekk Login',
        url: 'https://api.sanity.io/v2021-10-01/auth/saml/login/46187778',
      },
    ],
  },
})

export default config

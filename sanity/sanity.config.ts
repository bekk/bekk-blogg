import {codeInput} from '@sanity/code-input'
import {nbNOLocale} from '@sanity/locale-nb-no'
import {table} from '@sanity/table'
import {visionTool} from '@sanity/vision'
import {createAuthStore, defineConfig, SchemaTypeDefinition} from 'sanity'
import {media} from 'sanity-plugin-media'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import schemas from './schemas/schema'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'

// Define your schema types explicitly
const schemaTypes = schemas as SchemaTypeDefinition[]

// Create the configuration with explicit typing
const config = defineConfig({
  basePath: '/',
  name: 'default',
  title: 'sanity',
  projectId: 'ah2n1vfr',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'bekk-blogg-prod',

  plugins: [
    nbNOLocale(),
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    media(),
    codeInput(),
    table(),
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
            route: '/:year/:day/:slug',
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
              const availableFrom = new Date(doc?.availableFrom ?? null)
              const day = availableFrom.getDate()
              const year = availableFrom.getFullYear()
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
  auth: createAuthStore({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? '',
    mode: 'replace',
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

import {codeInput} from '@sanity/code-input'
import {visionTool} from '@sanity/vision'
import {createAuthStore, defineConfig, SchemaTypeDefinition} from 'sanity'
import {media} from 'sanity-plugin-media'
import {presentationTool} from 'sanity/presentation'
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
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'bekk-blogg',

  document: {
    // prev is the result from previous plugins and thus can be composed
    productionUrl: async (prev, context) => {
      // context includes the client and other details
      const {getClient, dataset, document} = context
      const client = getClient({apiVersion: process.env.SANITY_STUDIO_API_VERSION ?? '2021-03-25'})

      if (document._type === 'post') {
        const post = await client.fetch<{slug: {current: string}; availableFrom: 'string'}>(
          `*[_type == 'post' && _id == $postId][0]`,
          {
            postId: document._id,
          },
        )

        if (!post) {
          return '/'
        }

        const slug = post?.slug?.current
        const availableFrom = new Date(post?.availableFrom ?? '')

        const params = new URLSearchParams()
        params.set('preview', 'true')
        params.set('dataset', dataset)

        return `${process.env.SANITY_STUDIO_FRONTEND_URL}/${availableFrom.getFullYear()}/${availableFrom.getDate()}/${slug}?${params}`
      }

      return prev
    },
  },

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    media(),
    codeInput(),
    presentationTool({
      previewUrl: process.env.SANITY_STUDIO_FRONTEND_URL,
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

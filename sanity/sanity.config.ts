import {visionTool} from '@sanity/vision'
import {media} from "sanity-plugin-media";
import {codeInput} from "@sanity/code-input";
import {structureTool} from "sanity/structure";
import {defineConfig, SchemaTypeDefinition} from "sanity";
import schemas from './schemas/schema'
import {frontendUrl} from "./src/environment";

// Define the auth provider type
interface AuthProvider {
  name: string
  title: string
  url: string
  logo: string
}

// Define your schema types explicitly
const schemaTypes = schemas as SchemaTypeDefinition[]

// Create the configuration with explicit typing
const config = defineConfig({
  basePath: '/',
  name: 'default',
  title: 'sanity',
  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',

  document: {
    // prev is the result from previous plugins and thus can be composed
    productionUrl: async (prev, context) => {
      // context includes the client and other details
      const {getClient, dataset, document} = context
      const client = getClient({apiVersion: process.env.SANITY_STUDIO_API_VERSION ?? '2021-03-25'})

      if (document._type === 'post') {
        const slug = await client.fetch(
          `*[_type == 'post' && _id == $postId][0].slug.current`,
          {postId: document._id}
        )

        console.log("JEEPIS")
        console.log(document._id)

        const params = new URLSearchParams()
        params.set('preview', 'true')
        params.set('dataset', dataset)

        return `${process.env.SANITY_STUDIO_FRONTEND_URL}/articles/${slug}?${params}`
      }

      return prev
    },
  },

  plugins: [
    structureTool(),
    visionTool(),
    media(),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
  auth: {
    redirectOnSingle: true,
    mode: 'replace',
    providers: [
      {
        name: 'bekk-login',
        title: 'Logg inn med Bekk',
        url: `${frontendUrl}/microsoft/auth`,
        logo: 'static/logo.svg',
      } as AuthProvider,
    ],
  },
})

export default config
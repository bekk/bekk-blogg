import {visionTool} from '@sanity/vision'
import {media} from "sanity-plugin-media";
import {codeInput} from "@sanity/code-input";
import {structureTool} from "sanity/structure";
import {defineConfig, SchemaTypeDefinition} from "sanity";
import schemas from './schemas/schema'

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
    providers: [
      {
        name: 'bekk-login',
        title: 'Logg inn med Bekk',
        url: 'http://localhost:5173/microsoft/auth',
        logo: 'static/logo.svg',
      } as AuthProvider,
    ],
  },
})

export default config
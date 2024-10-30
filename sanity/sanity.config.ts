import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import schemas from './schemas/schema'
import {media} from 'sanity-plugin-media'
import {codeInput} from '@sanity/code-input'
import deskStructure, {defaultDocumentNode} from './deskStructure'
import resolveProductionUrl from './resolveProductionUrl'
import {deskTool} from "sanity/lib/desk";

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',
  apiVersion: process.env.sanityApiVersion || 'v2021-08-18',

  plugins: [
    deskTool({
      defaultDocumentNode,
      structure: deskStructure,
    }),
    visionTool(),
    media(),
    codeInput(),
  ],

  schema: {
    types: schemas,
  },
  document: {
    productionUrl: async (_, context) => resolveProductionUrl(context.document),
  },

  auth: {
    redirectOnSingle: true,
    providers: [
      {
        name: 'bekk-login',
        title: 'Logg inn med Bekk',
        url: 'http://localhost:5173/microsoft/auth',
        logo: 'static/logo.svg',
      },
    ],
  },
})

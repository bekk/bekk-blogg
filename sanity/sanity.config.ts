import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import schemas from './schemas/schema'
import {deskTool} from 'sanity/desk'
import {media} from 'sanity-plugin-media'
import {codeInput} from '@sanity/code-input'
import deskStructure, {defaultDocumentNode} from './deskStructure'
import resolveProductionUrl from './resolveProductionUrl'

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',

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
        url: 'https://bekk-christmas.vercel.app/api/auth/login',
        logo: 'static/logo.svg',
      },
    ],
  },
})

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',

  plugins: [structureTool(), visionTool()],

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
        url: 'https://fagdag.bekk.no/api/auth/signin',
        logo: 'static/logo.svg',
      },
    ],
  }
})

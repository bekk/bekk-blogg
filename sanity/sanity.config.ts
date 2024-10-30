import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',
  apiVersion: process.env.sanityApiVersion || 'v2021-08-18',

  plugins: [structureTool(), visionTool()],

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
      },
    ],
  }
})

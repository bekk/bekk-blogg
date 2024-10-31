import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import type {Config} from 'sanity'
import {media} from "sanity-plugin-media";
import {codeInput} from "@sanity/code-input";
import {structureTool} from "sanity/structure";

// Define the auth provider type
interface AuthProvider {
  name: string
  title: string
  url: string
  logo: string
}

// Define your schema types explicitly
const schemas = (await import('./schemas/schema')).default

// Create the configuration with explicit typing
const config: Config = {
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
    types: schemas,
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
}

export default defineConfig(config)
import { defineCliConfig } from 'sanity/cli'

// Sanity CLI kjøres fra denne mappen, siden den bruker mappen med sanity.config.ts som prosjektrot
export default defineCliConfig({
  api: {
    projectId: 'ah2n1vfr',
    dataset: 'bekk-blogg-prod',
  },
  typegen: {
    path: '../utils/sanity/queries/*.ts',
    schema: 'schema.json',
    generates: '../utils/sanity/types/sanity.types.ts',
    overloadClientMethods: true,
    // Formateres med oxfmt og web sin config i `npm run typegen` i stedet. Den innebygde
    // oxfmt-støtten leser ikke .oxfmtrc.json.
    formatGeneratedCode: false,
  },
})

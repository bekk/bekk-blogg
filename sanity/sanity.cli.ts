import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ah2n1vfr',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'bekk-blogg-prod',
  },
  /**
   * Auto-oppdateringer er skrudd av, så Studio ikke bytter versjon av seg selv
   * (f.eks. midt i desember). Versjonen styres av package.json.
   */
  deployment: {autoUpdates: false},
  typegen: {
    path: '../web/utils/sanity/queries/*.ts',
    schema: 'schema.json',
    generates: '../web/utils/sanity/types/sanity.types.ts',
    overloadClientMethods: true,
    // Formateres med oxfmt og web sin config i `npm run typegen` i stedet. Den innebygde
    // oxfmt-støtten leser ikke .oxfmtrc.json, og Prettier er ikke lenger i bruk.
    formatGeneratedCode: false,
  },
})

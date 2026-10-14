import {defineField, defineType} from 'sanity'

/**
 * AI-generert «Kort fortalt» for et innlegg: sammendrag, målgruppe og forkunnskaper.
 *
 * Ligger i et eget dokument (med id `summary-<postId>`) av samme grunn som
 * opplesningene: det overskrives ikke når et utkast publiseres, og genereringen
 * trigger ikke nye webhooks for innlegget. Dokumentene skrives av web-appen.
 * Redaksjonen overstyrer eller skjuler sammendraget fra feltet «Kort fortalt» på
 * innlegget.
 */
const postSummary = defineType({
  title: 'Kort fortalt (AI-generert)',
  name: 'postSummary',
  type: 'document',
  readOnly: true,
  // Skrives av webhooken, så AI Assist skal ikke røre dem
  options: {aiAssist: {exclude: true}},
  fields: [
    defineField({
      title: 'Innlegg',
      name: 'post',
      type: 'reference',
      to: [{type: 'post'}],
      // Svak referanse, så innlegget kan slettes uten å slette sammendraget først
      weak: true,
    }),
    defineField({
      title: 'Kort fortalt',
      name: 'tldr',
      type: 'text',
    }),
    defineField({
      title: 'Passer for',
      name: 'audience',
      type: 'string',
    }),
    defineField({
      title: 'Fint å kunne fra før',
      name: 'prerequisites',
      type: 'string',
    }),
    defineField({
      title: 'Modell',
      name: 'model',
      type: 'string',
    }),
    defineField({
      title: 'Hash av teksten som ble oppsummert',
      description: 'Brukes til å avgjøre om sammendraget må genereres på nytt',
      name: 'sourceHash',
      type: 'string',
    }),
    defineField({
      title: 'Generert',
      name: 'generatedAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {title: 'post.title', subtitle: 'tldr'},
  },
})

export default postSummary

import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * AI-generert tilbakemelding på et utkast, bestilt med «Be om tilbakemelding».
 *
 * Ligger i `review.<postId>`. Punktumet gjør dokumentet privat, selv om datasettet
 * er offentlig, siden tilbakemeldingen siterer upubliserte utkast. Dokumentene
 * skrives av web-appen (utils/review) og vises i fanen «Tilbakemelding (AI)».
 */
const postReview = defineType({
  title: 'Tilbakemelding (AI-generert)',
  name: 'postReview',
  type: 'document',
  readOnly: true,
  options: { aiAssist: { exclude: true } },
  fields: [
    defineField({
      title: 'Innlegg',
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
      weak: true,
    }),
    defineField({
      title: 'Bestilt',
      description: 'Tidsstempelet fra innlegget som denne tilbakemeldingen svarer på',
      name: 'requestedAt',
      type: 'datetime',
    }),
    defineField({
      title: 'Status',
      name: 'status',
      type: 'string',
      options: { list: ['done', 'failed'] },
    }),
    defineField({
      title: 'Feilmelding',
      name: 'error',
      type: 'string',
    }),
    defineField({
      title: 'Helhetsinntrykk',
      name: 'summary',
      type: 'text',
    }),
    defineField({
      title: 'Dette fungerer',
      name: 'strengths',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      title: 'Punkter',
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reviewItem',
          fields: [
            defineField({ name: 'category', title: 'Kategori', type: 'string' }),
            defineField({ name: 'severity', title: 'Alvorlighet', type: 'string' }),
            defineField({ name: 'quote', title: 'Sitat', type: 'string' }),
            defineField({ name: 'comment', title: 'Kommentar', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({
      title: 'Døde lenker',
      name: 'deadLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'deadLink',
          fields: [
            defineField({ name: 'url', title: 'URL', type: 'string' }),
            defineField({ name: 'reason', title: 'Grunn', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      title: 'Modell',
      name: 'model',
      type: 'string',
    }),
    defineField({
      title: 'Generert',
      name: 'generatedAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'post.title', subtitle: 'summary' },
  },
})

export default postReview

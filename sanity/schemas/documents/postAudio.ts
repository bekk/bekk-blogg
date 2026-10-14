import {defineField, defineType} from 'sanity'

/**
 * Forhåndsgenerert opplesning av et innlegg.
 *
 * Ligger i et eget dokument (med id `audio-<postId>`) i stedet for som et felt på
 * innlegget. Da overskrives den ikke når et utkast publiseres, og genereringen
 * trigger ikke nye webhooks for innlegget. Dokumentene skrives av web-appen og
 * skal ikke redigeres for hånd.
 */
const postAudio = defineType({
  title: 'Opplesning',
  name: 'postAudio',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      title: 'Innlegg',
      name: 'post',
      type: 'reference',
      to: [{type: 'post'}],
      // Svak referanse, så innlegget kan slettes uten å slette opplesningen først
      weak: true,
    }),
    defineField({
      title: 'Lydfil',
      name: 'audio',
      type: 'file',
      options: {accept: 'audio/mpeg'},
    }),
    defineField({
      title: 'Stemme',
      name: 'voice',
      type: 'string',
    }),
    defineField({
      title: 'Grunnlag for stemmevalget',
      description: 'Forfatterens foretrukne stemme og navn. Endres det, velges stemmen på nytt.',
      name: 'voiceKey',
      type: 'string',
      hidden: true,
    }),
    defineField({
      title: 'Hash av teksten som ble lest opp',
      description: 'Brukes til å avgjøre om opplesningen må genereres på nytt',
      name: 'sourceHash',
      type: 'string',
    }),
    defineField({
      title: 'Antall tegn',
      name: 'characters',
      type: 'number',
    }),
    defineField({
      title: 'Generert',
      name: 'generatedAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {title: 'post.title', generatedAt: 'generatedAt'},
    prepare: ({title, generatedAt}) => ({
      title: title ?? 'Ukjent innlegg',
      subtitle: generatedAt
        ? `Generert ${new Date(generatedAt).toLocaleString('nb-NO')}`
        : undefined,
    }),
  },
})

export default postAudio

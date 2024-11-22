import {defineType} from 'sanity'

const post = defineType({
  title: 'Innlegg',
  name: 'post',
  type: 'document',
  groups: [
    {
      title: 'Innhold',
      name: 'author',
    },
    {
      title: 'Admin',
      name: 'admin',
    },
  ],
  fields: [
    {
      title: 'Type',
      name: 'type',
      type: 'string',
      initialValue: 'article',
      options: {
        list: [
          {title: 'Artikkel', value: 'article'},
          {title: 'Video', value: 'video'},
          {title: 'Podkast', value: 'podcast'},
        ],
      },
      group: 'author',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Tittel',
      description: 'Hold det kort og beskrivende!',
      name: 'title',
      type: 'string',
      group: 'author',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Slug',
      description: 'Det som kommer etter bekk.christmas/post/år/dag/.. i URL-en',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      group: 'author',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Embed URL',
      description:
        'Hvis du laster opp en video eller podkast, må du laste opp innholdet til noen som har erfaring med dette. Last opp podkaster til anchor.fm og videoer til vimeo.com. Hvis du trenger tilgang, ta kontakt med Kristofer G. Selbekk.',
      name: 'embedUrl',
      type: 'url',
      group: 'author',
      validation: (rule) =>
        rule.custom((url: string | undefined, context) => {
          const postType = context.document?.type as string
          if (['podcast', 'video'].includes(postType) && !url) {
            return 'Embed URL er påkrevd'
          }
          if (postType === 'video' && !url?.startsWith('https://player.vimeo.com')) {
            return 'Bruk embed-URL, ikke vanlig URL. Den skal starte med player.vimeo.com/video'
          }
          return true
        }),
      hidden: ({document}) => {
        return document?.type === 'article'
      },
    },
    {
      title: 'Podkastlengde',
      description: 'Lengden på podkasten i minutter',
      name: 'podcastLength',
      type: 'number',
      group: 'author',
      validation: (rule) =>
        rule.custom((length, context) => {
          if (context.document?._type !== 'podcast') {
            return true
          }
          return length ? true : 'Vennligst oppgi lengden på podkasten'
        }),
      hidden: ({document}) => {
        return document?.type !== 'podcast'
      },
    },
    {
      title: 'Ingress',
      description: 'En kort intro',
      name: 'description',
      type: 'descriptionText',
      group: 'author',
    },
    {
      title: 'Preview-tekst',
      description: 'Tekst som vises i dagsoppsummeringen og på sosiale medier',
      name: 'previewText',
      type: 'text',
      group: 'author',
      validation: (rule) => rule.max(155),
    },
    {
      title: 'Innhold',
      name: 'content',
      type: 'portableText',
      group: 'author',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Forsidebilde',
      description: 'Vises øverst på siden og i innleggkortene',
      name: 'coverImage',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternativ tekst',
          description: 'Viktig for SEO og tilgjengelighet.',
        },
        {
          title: 'Bildekilde',
          name: 'src',
          type: 'string',
        },
        {
          title: 'Skjul fra innlegget',
          description:
            'Kryss av her hvis du kun vil at bildet skal vises på lukesiden, ikke i ditt eget innlegg',
          name: 'hideFromPost',
          type: 'boolean',
        },
      ],
      group: 'author',
    },
    {
      title: 'Bidragsytere',
      description: 'De som har laget innholdet. Husk å legge til deg selv!',
      name: 'authors',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
        {
          type: 'reference',
          to: [{type: 'author'}],
        },
      ],
      group: 'author',
    },
    {
      title: 'Kategori',
      name: 'tags',
      description: 'Hovedkategori for innlegget',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
      group: 'author',
    },
    {
      title: 'Søkbare nøkkelord',
      name: 'keywords',
      description: 'Nøkkelord som hjelper å søke seg fram til innlegget',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'author',
    },
    {
      title: 'Relevante lenker',
      name: 'relatedLinks',
      description: 'Fagstoff som er relevant for innholdet',
      type: 'array',
      of: [
        {
          title: 'Relevant lenke',
          name: 'relatedLink',
          type: 'object',
          fields: [
            {
              title: 'Tittel',
              name: 'title',
              type: 'string',
            },
            {
              title: 'Beskrivelse',
              name: 'description',
              type: 'string',
            },
            {
              title: 'Lenke',
              name: 'url',
              type: 'url',
            },
          ],
        },
      ],
      group: 'author',
    },
    {
      name: 'canonicalUrl',
      type: 'url',
      title: 'Originallenke',
      description:
        'Hvis innholdet har blitt publisert et annet sted først kan du lenke til det her',
      group: 'author',
    },
    {
      title: 'Språk',
      name: 'language',
      type: 'string',
      options: {
        list: [
          {title: 'Engelsk', value: 'en-US'},
          {title: 'Norsk (Bokmål)', value: 'nb-NO'},
          {title: 'Norsk (Nynorsk)', value: 'nn-NO'},
        ],
      },
      group: 'author',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Publiseringsdato',
      name: 'availableFrom',
      description: 'Når innlegget skal publiseres',
      type: 'date',
      group: 'admin',
      validation: (rule) => rule.required(),
      initialValue: `${new Date().getUTCFullYear()}-12-25`,
    },
    {
      title: 'Prioritet',
      name: 'priority',
      description: 'Hvilken rekkefølge innlegg skal være i. Jo høyere tall jo høyere opp på siden',
      type: 'number',
      initialValue: 0,
      group: 'admin',
    },
  ],
  preview: {
    select: {
      title: 'title',
      tag: 'tags.0.name',
      author: 'authors.0.fullName',
      extraAuthor: 'authors.1.fullName',
      media: 'coverImage',
    },
    prepare({title, tag, author, extraAuthor, media}) {
      const authors = extraAuthor ? `${author}, ${extraAuthor}` : author
      return {
        title: title,
        subtitle: `${authors} – ${tag || 'Ingen kategori 🤷'}`,
        media: media,
      }
    },
  },
})

export default post

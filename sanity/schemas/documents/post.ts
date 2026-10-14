import {BiBook} from 'react-icons/bi'
import {defineType} from 'sanity'

const post = defineType({
  title: 'Innlegg',
  name: 'post',
  type: 'document',
  icon: BiBook,
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
        maxLength: 96,
      },
      group: 'author',
      validation: (rule) => [
        rule.required(),
        // Slug er et objekt, så `max()` virker ikke her. Den krasjer valideringen.
        rule
          .custom((slug?: {current?: string}) =>
            (slug?.current?.length ?? 0) > 96 ? 'Lange slugs gir lange og uleselige URL-er' : true,
          )
          .warning(),
      ],
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
      initialValue: 'nb-NO',
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
        rule
          .custom((length, context) => {
            if (context.document?.type !== 'podcast') {
              return true
            }
            return length ? true : 'Vennligst oppgi lengden på podkasten'
          })
          // Advarsel, ikke feil, så eldre podkaster uten lengde fortsatt kan redigeres
          .warning(),
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
          validation: (rule) =>
            rule
              .custom((alt, context) => {
                const hasImage = Boolean((context.parent as {asset?: unknown} | undefined)?.asset)
                return hasImage && !alt ? 'Legg inn en alternativ tekst for bildet' : true
              })
              .warning(),
        },
        {
          title: 'Bildekilde',
          name: 'src',
          type: 'string',
          hidden: true,
          deprecated: {
            reason: 'Bildekilde er ikke lenger nødvendig – last opp bilder til Sanity',
          },
        },
        {
          title: 'Skjul fra innlegget',
          description:
            'Kryss av her hvis du kun vil at bildet skal vises på lukesiden, ikke i ditt eget innlegg',
          name: 'hideFromPost',
          type: 'boolean',
          hidden: true,
          deprecated: {
            reason: 'Støttes ikke lenger',
          },
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
      title: 'Serie',
      description: 'Hvis innlegget er en del av en serie, velg hvilken',
      name: 'series',
      type: 'reference',
      to: [{type: 'series'}],
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
      title: 'Publiseringsdato',
      name: 'availableFrom',
      description: 'Når innlegget skal publiseres',
      type: 'date',
      group: 'admin',
      validation: (rule) => [
        rule.required(),
        rule
          .custom((date?: string) => {
            if (!date) return true
            const [, month, day] = date.split('-').map(Number)
            return month === 12 && day >= 1 && day <= 24
              ? true
              : 'Innlegg utenfor 1.–24. desember får ingen side i kalenderen'
          })
          .warning(),
      ],
      // Bevisst en dato uten luke, så nye innlegg ikke havner i kalenderen før
      // noen har valgt en dag
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
    {
      name: 'points',
      title: 'Poeng',
      description: 'Hvor mange tomler opp innlegget har fått',
      type: 'number',
      group: 'admin',
      initialValue: 0,
      readOnly: true,
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

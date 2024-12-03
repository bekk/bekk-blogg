import {BiCollection} from 'react-icons/bi'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'series',
  title: 'Serie',
  type: 'document',
  icon: BiCollection,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'shouldListNonPublishedContent',
      title: 'Vis ikke-publisert innhold?',
      description:
        'Hvis du sier at ja, vil ikke-publisert innhold også listes opp (men ikke lenket til).',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

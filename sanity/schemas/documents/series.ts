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
      name: 'posts',
      title: 'Innlegg',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
      validation: (rule) => rule.required().min(2),
    }),
  ],
})

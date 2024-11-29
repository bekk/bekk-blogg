import {BiCollection} from 'react-icons/bi'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Samling',
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
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'posts',
      title: 'Innlegg',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})

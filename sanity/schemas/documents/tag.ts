import {defineType} from 'sanity'

const tag = defineType({
  title: 'Kategori',
  name: 'tag',
  type: 'document',
  fields: [
    {
      title: 'Slug',
      name: 'slug',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        source: 'name',
      },
    },
    {
      title: 'Navn',
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Synonymer',
      name: 'synonyms',
      description: 'Alternative ord eller uttrykk',
      type: 'array',
      options: {layout: 'tags'},
      of: [
        {
          type: 'string',
        },
      ],
    },
  ],
})

export default tag

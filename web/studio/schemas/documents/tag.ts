import { BiTag } from 'react-icons/bi'
import { defineType } from 'sanity'

const tag = defineType({
  title: 'Kategori',
  name: 'tag',
  type: 'document',
  icon: BiTag,
  fields: [
    {
      title: 'Navn',
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    },
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
      title: 'Tidligere slugs',
      name: 'previousSlugs',
      description: 'Gamle adresser (/kategori/<slug>) som videresendes hit, f.eks. etter at kategorier er slått sammen',
      type: 'array',
      options: { layout: 'tags' },
      of: [{ type: 'string' }],
    },
    {
      title: 'Synonymer',
      name: 'synonyms',
      description: 'Alternative ord eller uttrykk',
      type: 'array',
      options: { layout: 'tags' },
      of: [
        {
          type: 'string',
        },
      ],
    },
  ],
})

export default tag

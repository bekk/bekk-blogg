import {BsQuote} from 'react-icons/bs'
import {defineField, defineType} from 'sanity'

const quote = defineType({
  title: 'Sitat',
  description: 'Et sitat fra en person eller fra artikkelen',
  name: 'quote',
  type: 'object',
  icon: BsQuote,
  fields: [
    defineField({
      title: 'Sitat',
      name: 'content',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Hvem sier det?',
      description:
        'Navnet på personen som sier sitatet. Om det er fra artikkelen, kan du hoppe over dette feltet',
      name: 'author',
      type: 'string',
    }),
  ],
})

export default quote

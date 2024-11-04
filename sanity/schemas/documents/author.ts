import {defineType} from 'sanity'

const author = defineType({
  title: 'Forfatter',
  name: 'author',
  type: 'document',
  fields: [
    {
      title: 'Fullt navn',
      name: 'fullName',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      options: {
        source: 'fullName',
      },
    },
    {
      title: 'Firmanavn',
      name: 'companyName',
      type: 'string',
      initialValue: 'Bekk',
    },
    {
      title: 'Profilbilde',
      name: 'profilePicture',
      type: 'string',
    },
    {
      title: 'Lenker til sosiale medier',
      name: 'socialMediaLinks',
      type: 'array',
      of: [{type: 'socialMediaLink'}],
    },
  ],
})

export default author

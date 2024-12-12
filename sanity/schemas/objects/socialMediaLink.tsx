import {defineType} from 'sanity'

const socialMediaLink = defineType({
  title: 'Social media link',
  name: 'socialMediaLink',
  type: 'object',
  fields: [
    {
      title: 'Type',
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Email', value: 'email'},
          {title: 'GitHub', value: 'gitHub'},
          {title: 'X / Twitter', value: 'twitter'},
          {title: 'bluesky', value: 'bluesky'},
          {title: 'Website', value: 'website'},
          {title: 'LinkedIn', value: 'linkedIn'},
          {title: 'Instagram', value: 'instagram'},
        ],
      },
      validation: (rule) => rule.required(),
    },
    {
      title: 'URL',
      name: 'url',
      type: 'string',
      validation: (rule) => rule.required(),
    },
  ],
})

export default socialMediaLink

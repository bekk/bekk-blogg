import { BiUser } from 'react-icons/bi'
import {defineType} from 'sanity'

const author = defineType({
  title: 'Forfatter',
  name: 'author',
  type: 'document',
  icon: BiUser,
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
      title: 'Foretrukket stemme',
      name: 'preferredVoice',
      type: 'string',
      description: 'Hvilken stemme vil du at artiklene dine skal leses opp med?',
      options: {
        list: [
          {title: 'Herrestemme', value: 'onyx'},
          {title: 'Kvinnestemme', value: 'nova'},
          {title: 'Nøytral stemme', value: 'shimmer'},
          {title: 'Ingen preferanse', value: 'none'},
        ],
      },
      initialValue: 'nova',
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

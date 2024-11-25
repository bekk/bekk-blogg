import { DescriptionText, POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

const authorTeaserPage: NonNullable<NonNullable<POST_BY_SLUGResult>['authors']>[0] = {
  _id: '',
  fullName: 'Bekk',
  _type: 'author',
  _createdAt: '2023-12-01',
  _updatedAt: '2023-12-01',
  _rev: '',
  slug: null,
  companyName: null,
  profilePicture: null,
  socialMediaLinks: null,
}
const tagTeaserPage: NonNullable<NonNullable<POST_BY_SLUGResult>['tags']>[0] = {
  _id: 'mock-tag-id',
  name: 'Til deg',
  _type: 'tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: '',
  synonyms: [],
  slug: null,
}

const descriptionText: DescriptionText = [
  {
    children: [
      {
        text: 'Hver dag en luke, en liten sak, \n som en bekk som renner, sakte og smak. \n Åpne med glede, se hva du får, \n snart er det jul, vi feirer i år! \n \n \n ',
        _type: 'span',
        _key: '',
      },
    ],
    _type: 'block',
    _key: '',
  },
]

export const mockPost: POST_BY_SLUGResult = {
  _id: 'mock-post-id',
  _type: 'post',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'mock-rev-3',
  title: 'bekk.christmas',
  slug: null,
  authors: [authorTeaserPage],
  tags: [tagTeaserPage],
  description: descriptionText,
  type: null,
  language: null,
  embedUrl: null,
  podcastLength: null,
  availableFrom: null,
  keywords: null,
  relatedLinks: null,
  canonicalUrl: null,
  previewText: null,
  priority: null,
  coverImage: null,
  content: null,
}

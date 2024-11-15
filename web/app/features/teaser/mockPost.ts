import { Author, DescriptionText, Post, Tag } from 'utils/sanity/types/sanity.types'

const authorTeaserPage: Author = {
  _id: '',
  fullName: 'Bekk',
  _type: 'author',
  _createdAt: '',
  _updatedAt: '',
  _rev: '',
}
const tagTeaserPage: Tag = {
  _id: '',
  name: 'Til: Dere',
  _type: 'tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: '',
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

export const mockPost: Post = {
  _id: '',
  _type: 'post',
  _createdAt: '',
  _updatedAt: '',
  _rev: '',
  title: 'bekk.christmas',
  authors: [authorTeaserPage],
  tags: [tagTeaserPage],
  description: descriptionText,
}

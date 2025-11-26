import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'

export const getPostUrl = (post: POSTS_BY_YEAR_AND_DATEResult[number], year: string, date: string) => {
  return `https://www.bekk.christmas/post/${year}/${date}/${post.slug.current}`
}

export const qrColors = [
  { bg: '#A63F48', fg: '#FDD0D8' },
  { bg: '#6D0D22', fg: '#FDD0D8' },
  { bg: '#A7060E', fg: '#FDD0D8' },
  { bg: '#ed7e87', fg: '#FEEFF1' },
  { bg: '#32432D', fg: '#D9DCCF' },
] as const

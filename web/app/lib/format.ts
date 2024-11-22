import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

export function postUrl(post: NonNullable<POST_BY_SLUGResult>) {
  const year = post.availableFrom?.split('-')[0]
  const date = post.availableFrom?.split('-')[2]
  const slug = post.slug?.current
  return `/${year}/${date}/${slug}`
}

import { Post } from '../../utils/sanity/types/sanity.types'

export function postUrl(post: Post) {
  const year = post.availableFrom?.split('-')[0]
  const date = post.availableFrom?.split('-')[2]
  const slug = post.slug?.current
  return `/${year}/${date}/${slug}`
}

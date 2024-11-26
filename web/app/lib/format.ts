type PostUrlArgs = {
  availableFrom?: string
  slug: { current?: string | null } | null
}
export function postUrl(post: PostUrlArgs) {
  const year = post.availableFrom?.split('-')[0]
  const date = post.availableFrom?.split('-')[2]
  const slug = post.slug?.current
  return `/${year}/${date}/${slug}`
}

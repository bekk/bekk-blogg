import { PortableText } from '@portabletext/react'
import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { components } from '../../utils/sanity/portable-text/Components'
import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'
import { Article } from '~/features/article/Article'

export const meta: MetaFunction = () => {
  return [{ title: 'Post' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader({ params }: { params: { slug: string } }) {
  const { data: post } = await loadQuery<Post>(POST_BY_SLUG, { slug: params.slug })
  return post
}

export default function Index() {
  const post = useLoaderData<Post>()

  return (
    <div className="striped-frame max-w-screen-2xl m-auto">
      <Article post={post} />
    </div>
  )
}

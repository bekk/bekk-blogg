import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { Article } from '~/features/article/Article'

export const meta: MetaFunction = ({ data }) => {
  const post = data as Post
  return [{ title: post?.title || 'Innlegg' }, { name: 'description', content: post.description }]
}

export async function loader({ params }: { params: { slug: string } }) {
  const { data: post } = await loadQuery<Post>(POST_BY_SLUG, { slug: params.slug })
  return post
}

export default function Index() {
  const post = useLoaderData<Post>()

  return (
    <div className="striped-frame m-auto max-w-screen-2xl">
      <Article post={post} />
    </div>
  )
}

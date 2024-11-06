import { PortableText } from '@portabletext/react'
import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { components } from '../../utils/sanity/portable-text/Components'
import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

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
    <div className="bg-postcard-beige p-7 sm:p-12 z-[1] relative max-w-screen-2xl m-auto bg-[url('../assets/striped-bg.svg')] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:right-0 before:bg-postcard-beige before:m-2 before:z-[-1] sm:before:m-3">
      <h1>{post.title}</h1>
      {post?.content && <PortableText value={post.content} components={components} />}
    </div>
  )
}

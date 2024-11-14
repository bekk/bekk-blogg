import type { MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

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

export const handle = {
  breadcrumb: ({ params }: { params: { year: string; date: string; slug: string } }) => {
    return <Link to={`/${params.year}/${params.date}/${params.slug}`}>💌 {params.slug}</Link>
  },
}

export default function Index() {
  const post = useLoaderData<Post>()

  return <Article post={post} />
}
/*
<div className="flex items-end justify-between p-0">
        <Header isInArticle={true} />
        <PostStamp />
      </div>
 */

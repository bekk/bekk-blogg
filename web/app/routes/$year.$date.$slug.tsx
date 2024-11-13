import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { urlFor } from 'utils/sanity/sanity.server'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { Article } from '~/features/article/Article'

export const meta: MetaFunction = ({ data }) => {
  const post = data as Post
  const availableFrom = post.availableFrom ? new Date(post.availableFrom) : undefined

  const meta = [
    { title: post?.title || 'Innlegg' },
    { name: 'description', content: post.description },
    { property: 'og:title', content: post?.title || 'Innlegg' },
    { property: 'og:description', content: post.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'article:published_time', content: post.availableFrom },
    { property: 'article:modified_time', content: post._updatedAt },
    { property: 'article:author', content: post.authors.map((author) => author.fullName).join(', ') },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post?.title || 'Innlegg' },
    { name: 'twitter:description', content: post.description },
    { name: 'twitter:site', content: '@livetibekk' },
  ]

  if (post.coverImage) {
    meta.push({ property: 'og:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
    meta.push({ name: 'twitter:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
  }

  if (availableFrom) {
    meta.push({
      property: 'og:url',
      content: `https://bekk.christmas/${availableFrom.getFullYear()}/${availableFrom.getDate().toString().padStart(2, '0')}/${post.slug}`,
    })
  }

  if (post.tags && post.tags.length > 0) {
    meta.push({ property: 'article:tag', content: post.tags.join(', ') })
  }

  return meta
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

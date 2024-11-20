import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { POSTS_BY_TAGS, TAG_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post, Tag } from '../../utils/sanity/types/sanity.types'

import { Letter } from '~/features/door/Letter'

export async function loader({ params }: LoaderFunctionArgs) {
  const { tag } = params
  if (!tag) {
    throw new Response('Missing tag', { status: 404 })
  }

  // Fetch posts and tag data in parallel
  const [postsData, tagData] = await Promise.all([
    loadQuery<Post[]>(POSTS_BY_TAGS, { t: tag }),
    loadQuery<Tag>(TAG_BY_SLUG, { slug: tag }),
  ])

  return json({ posts: postsData.data, tag: tagData.data })
}

export default function Posts() {
  const { posts, tag } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
      <h1 className="font-delicious pb-4  md:pb-8 md:text-center">{tag.name}</h1>
      <div className="flex flex-col gap-8 md:gap-12">
        {posts.length === 0 && <p>Ingen innlegg i denne kategorien</p>}

        {posts.map((post, i) => {
          const year = post.availableFrom?.split('-')[0]
          const date = post.availableFrom?.split('-')[1]
          const slug = post.slug?.current

          return (
            <Link to={`/${year}/${date}/${slug}`} key={i}>
              <Letter key={post._id} post={post} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

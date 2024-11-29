import { json, MetaFunction } from '@remix-run/node' // Ensure to use json here
import { Link, useLoaderData, useNavigation } from '@remix-run/react'

import { ALL_CATEGORIES } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Tag } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'

export async function loader() {
  try {
    const { data } = await loadQuery<Tag[]>(ALL_CATEGORIES)
    return json(data) // Wrap the data in a json response
  } catch (error) {
    console.error(error)
    // Return an error response for the client
    throw new Response('Failed to load categories', { status: 500 })
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `Innhold fra ${data?.length} kategorier | Bekk Christmas`
  const description = `Utforsk ${data?.length} kategorier på Bekk Christmas`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
  ]
}

export default function TagsRoute() {
  const data = useLoaderData<typeof loader>() // Safely use the loader's data
  const state = useNavigation()
  return (
    <>
      {state.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="px-2 sm:px-8 flex flex-col">
          <h1 className="text-center text-3xl sm:text-4xl text-white pt-4">Kategorier</h1>
          <div className="flex flex-wrap justify-center pt-12 sm:pt-20 md:pt-28 gap-2 md:gap-4 2xl:mt-20">
            {data.map((category: Tag, index: number) => (
              <Link
                to={`/kategori/${category.slug}`}
                className="hover:text-reindeer-brown md:text-subtitle-desktop"
                key={index}
              >
                <p className="styled-box sm:text-2xl px-4">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

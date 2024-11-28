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
        <div className="p-8">
          <h1 className="md:text-center pb-2 md:pb-4">Kategorier</h1>
          <ul className="flex flex-row flex-wrap gap-2 md:gap-4">
            {data.map((category: Tag, index: number) => (
              <li className={'hover:text-reindeer-brown md:text-subtitle-desktop'} key={index}>
                <Link to={`/kategori/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

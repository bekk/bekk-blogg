import { json } from '@remix-run/node' // Ensure to use json here
import { Link, useLoaderData } from '@remix-run/react'

import { ALL_CATEGORIES } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Tag } from '../../utils/sanity/types/sanity.types'

// Route component
export default function TagsRoute() {
  const data = useLoaderData<typeof loader>() // Safely use the loader's data
  return (
    <div className="p-8">
      <h1 className="md:text-center font-delicious pb-2 md:pb-4">Kategorier</h1>
      <ul className="flex flex-row flex-wrap gap-2 md:gap-4">
        {data.map((category: Tag, index: number) => (
          <li className={'hover:text-reindeer-brown md:text-subtitle-desktop'} key={index}>
            <Link to={`/tags/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

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

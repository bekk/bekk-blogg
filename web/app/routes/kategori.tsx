import { Link, MetaFunction, useLoaderData, useNavigation } from 'react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { loadQuery } from 'utils/sanity/loader.server'
import { ALL_CATEGORIES } from '../../utils/sanity/queries/postQueries'
import { Tag } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'
import { ErrorPage } from '~/features/error-boundary/ErrorPage'

export async function loader() {
  try {
    const { data } = await loadQuery<Tag[]>(ALL_CATEGORIES)
    return data
  } catch (error) {
    console.error(error)
    // Return an error response for the client
    throw new Response('Failed to load categories', { status: 500 })
  }
}

const MotionLink = motion(Link)

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
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

function TagItem({ category }: { category: Tag }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <MotionLink
      to={`/kategori/${category.slug}`}
      className="rounded hover:text-soft-pink text-white md:text-subtitle-desktop focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-berry"
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      animate={isFocused ? { scale: 1.04, y: -3 } : { scale: 1, y: 0 }}
    >
      <span className="bg-dark-red rounded sm:text-2xl py-2 px-6 inline-block">{category.name}</span>
    </MotionLink>
  )
}

export default function TagsRoute() {
  const data = useLoaderData<typeof loader>() // Safely use the loader's data
  const state = useNavigation()
  return (
    <div className="pb-8">
      {state.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="px-2 sm:px-8 mb-8 flex flex-col">
          <h1 className="text-center text-3xl sm:text-4xl text-red-berry pt-4">Kategorier</h1>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {data.map((category: Tag, index: number) => (
              <TagItem key={index} category={category} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const ErrorBoundary = () => {
  return (
    <ErrorPage
      title="Uventet feil"
      description="Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen."
    />
  )
}

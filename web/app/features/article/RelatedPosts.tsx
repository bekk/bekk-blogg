import { InstantSearch, RelatedProducts } from 'react-instantsearch'
import { RelatedPostsLayout } from '~/features/article/RelatedPostLayout'
import { useRef } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { useMatches } from '@remix-run/react'

interface RelatedPostsProps {
  objectID: string
}

const useAlgoliaConfig = () => {
  const rootMatch = useMatches().find((match) => match.id === 'root')
  return (rootMatch?.data as { algolia: { app: string; key: string; index: string } })?.algolia
}

export const RelatedPosts = ({ objectID }: RelatedPostsProps) => {
  const algolia = useAlgoliaConfig()
  const searchClient = useRef(algoliasearch(algolia?.app, algolia?.key))
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0]

  return (
    <div className="bg-purple-cloth relative w-screen flex mt-2 md:mt-6 pb-12 justify-center ">
      <div className="pt-10 md:pt-20 max-w-[1540px] lg:mx-6 mx-4">
        <InstantSearch searchClient={searchClient.current} indexName={algolia.index}>
          <RelatedProducts
            headerComponent={() => (
              <div>
                <h2 className="text-white mb-4">Relatert innhold</h2>
                <p className="text-white mb-8">Hvis du likte denne artikkelen vil du kanskje også like disse:</p>
              </div>
            )}
            objectIDs={[objectID]}
            limit={10}
            layoutComponent={({ items }) => {
              const filteredItems = items
                .filter((item) => item.availableFrom <= formattedDate)
                .slice(0, 3)
                .filter((item) => !item._id.startsWith('drafts.'))
              return (
                <RelatedPostsLayout
                  items={filteredItems.map((item) => ({
                    objectID: item.objectID,
                    name: item.title,
                    image: item.image,
                    author: item.authors,
                    tags: item.tags || [],
                    slug: item.slug?.current,
                    availableFrom: item.availableFrom,
                  }))}
                />
              )
            }}
            emptyComponent={() => <p className="text-black">Ingen anbefalinger</p>}
          />
        </InstantSearch>
      </div>
    </div>
  )
}

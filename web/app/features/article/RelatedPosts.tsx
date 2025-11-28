import { InstantSearch, RelatedProducts } from 'react-instantsearch'
import { RelatedPostsLayout } from '~/features/article/RelatedPostLayout'
import { useAlgoliaClient, useAlgoliaConfig } from '~/hooks/useAlgolia'

interface RelatedPostsProps {
  objectID: string
}

export const RelatedPosts = ({ objectID }: RelatedPostsProps) => {
  const algoliaConfig = useAlgoliaConfig()
  const client = useAlgoliaClient()

  return (
    <div className="relative flex mt-2 md:mt-6 justify-center min-h-[500px] max-lg:pb-4">
      <div className="pt-10 md:pt-20 max-w-[1540px] mx-4 md:mx-7 lg:mx-7">
        <InstantSearch
          searchClient={client.current}
          indexName={algoliaConfig.index}
          future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true }}
        >
          <RelatedProducts
            headerComponent={() => (
              <div>
                <h2 className="text-red-berry mb-20 text-xl">Hvis du likte denne artikkelen vil du også like disse:</h2>
              </div>
            )}
            queryParameters={{ filters: `availableFromMillis <=  ${Date.now()}` }}
            objectIDs={[objectID]}
            limit={3}
            layoutComponent={({ items }) => {
              const filteredItems = items.filter((item) => !item._id.startsWith('drafts.'))
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
                    summary: item.summary,
                    coverImage: item.coverImage,
                    podcastLength: item.podcastLength,
                    wordCount: item.wordCount,
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

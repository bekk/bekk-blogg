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
    <div className="bg-purple-cloth relative w-screen flex mt-2 md:mt-6 pb-12 justify-center ">
      <div className="pt-10 md:pt-20 max-w-[1540px] lg:mx-6 mx-4">
        <InstantSearch
          searchClient={client.current}
          indexName={algoliaConfig.index}
          future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true }}
        >
          <RelatedProducts
            headerComponent={() => (
              <div>
                <h2 className="text-white mb-4">Relatert innhold</h2>
                <p className="text-white mb-8">Hvis du likte dette innholdet vil du kanskje også like:</p>
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

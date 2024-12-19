import { Link } from '@remix-run/react'
import { Configure, Hits, InstantSearch, InstantSearchSSRProvider, useSearchBox } from 'react-instantsearch'
import { useAlgoliaClient, useAlgoliaConfig } from '~/hooks/useAlgolia'
import { postUrl } from '~/lib/format'

export const Search = () => {
  const algoliaConfig = useAlgoliaConfig()
  const client = useAlgoliaClient()

  return (
    <InstantSearchSSRProvider>
      <InstantSearch
        searchClient={client.current}
        indexName={algoliaConfig.index}
        future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true }}
      >
        <SearchBoxWithDropdown />
        <Configure hitsPerPage={5} filters={`availableFromMillis <=  ${Date.now()}`} />
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}

const SearchBoxWithDropdown = () => {
  const { query, refine, clear } = useSearchBox()

  return (
    <div className="relative w-[75%] md:w-[500px]">
      <CustomSearchBox query={query} refine={refine} clear={clear} />
      {query && (
        <div className="absolute z-[100] mt-2 w-full bg-white bg-opacity-90 shadow-lg rounded-lg border border-gray-300">
          <Hits hitComponent={Hit} />
        </div>
      )}
    </div>
  )
}

function CustomSearchBox({
  query,
  refine,
  clear,
}: {
  query: string
  refine: (value: string) => void
  clear: () => void
}) {
  return (
    <>
      <label htmlFor="search" className="sr-only">
        Søk
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Søk"
        onReset={clear}
        className="w-full max-w-lg h-12 px-4 py-2 text-lg bg-transparent rounded-sm border border-white focus:outline-none focus:ring-2 focus:ring-white focus:text-white placeholder-white"
      />
    </>
  )
}

const Hit = ({
  hit,
}: {
  hit: {
    title: string
    authors: string[] | null
    tags: string[] | null
    slug: { current?: string | null } | null
    availableFrom: string | null
  }
}) => {
  const title = hit.title
  const link =
    hit.availableFrom && hit.slug?.current ? postUrl({ availableFrom: hit.availableFrom, slug: hit.slug }) : '#'

  const formatter = new Intl.ListFormat('no', { style: 'long', type: 'conjunction' })
  const authors = hit.authors && hit.authors.length > 0 ? formatter.format(hit.authors) : null
  const tags = hit.tags && hit.tags.length > 0 ? formatter.format(hit.tags) : null

  return (
    <div className="px-4 py-2 border-b hover:bg-gray-300 rounded-sm">
      <Link to={link}>
        <div className="text-base text-black">{title}</div>
        <div className="text-sm text-gray-600">
          {authors && <span>{authors}</span>}
          {tags && (
            <>
              {authors && ' - '}
              <span>{tags}</span>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}

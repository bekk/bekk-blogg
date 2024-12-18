import { SearchClient } from 'algoliasearch'
import { Link } from '@remix-run/react'
import { Configure, Hits, InstantSearch, useSearchBox } from 'react-instantsearch'
import { postUrl } from '~/lib/format'
export const Search = ({
  searchClient,
  indexName,
}: {
  searchClient: React.MutableRefObject<SearchClient>
  indexName: string
}) => {
  return (
    <InstantSearch searchClient={searchClient.current} indexName={indexName}>
      <SearchBoxWithDropdown />
      <Configure hitsPerPage={5} />
    </InstantSearch>
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
    <input
      type="search"
      value={query}
      onChange={(event) => refine(event.currentTarget.value)}
      placeholder="Søk"
      onReset={clear}
      className="w-full max-w-lg h-12 px-4 py-2 text-lg bg-transparent rounded-sm border border-white focus:outline-none focus:ring-2 focus:ring-white focus:text-white placeholder-white"
    />
  )
}

const SearchBoxWithDropdown = () => {
  const { query, refine, clear } = useSearchBox()

  return (
    <div className="relative w-[75%] md:w-[500px]">
      <CustomSearchBox query={query} refine={refine} clear={clear} />
      {query && (
        <div className="absolute z-10 mt-2 w-full bg-white bg-opacity-90 shadow-lg rounded-lg border border-gray-300">
          <Hits hitComponent={Hit} />
        </div>
      )}
    </div>
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

  return (
    <div className="px-4 py-2 border-b border-black ">
      <Link to={link} className="text-black hover:text-reindeer-brown">
        <div className="font-semibold text-base">{title}</div>
        <div className="text-sm text-gray-600">
          {hit.authors && hit.authors.length > 0 && <span>{hit.authors.join(', ')}</span>}
          {hit.tags && hit.tags.length > 0 && (
            <>
              {hit.authors && hit.authors.length > 0 && ' - '}
              <span>{hit.tags.join(', ')}</span>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}

import { Link } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { Configure, Hits, InstantSearch, InstantSearchSSRProvider, useSearchBox } from 'react-instantsearch'
import { useAlgoliaClient, useAlgoliaConfig } from '~/hooks/useAlgolia'
import { postUrl } from '~/lib/format'

type SearchProps = {
  transparent?: boolean
}

export const Search = ({ transparent = true }: SearchProps) => {
  const algoliaConfig = useAlgoliaConfig()
  const client = useAlgoliaClient()

  return (
    <InstantSearchSSRProvider>
      <InstantSearch
        searchClient={client.current}
        indexName={algoliaConfig.index}
        future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true }}
      >
        <SearchBoxWithDropdown transparent={transparent} />
        <Configure hitsPerPage={20} filters={`availableFromMillis <=  ${Date.now()}`} />
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}

const SearchBoxWithDropdown = ({ transparent }: SearchProps) => {
  const { query, refine, clear } = useSearchBox()
  const searchRef = useRef<HTMLDivElement | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowResults(false)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowResults(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="relative w-[75%] md:w-[500px]" ref={searchRef}>
      <CustomSearchBox
        query={query}
        refine={(value: string) => {
          setShowResults(true)
          refine(value)
        }}
        clear={clear}
        transparent={transparent}
      />
      {query && showResults && (
        <div className="absolute z-[100] mt-2 w-full bg-white bg-opacity-90 shadow-lg rounded-lg border border-gray-300 max-h-[290px] overflow-y-scroll">
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
  transparent,
}: {
  query: string
  refine: (value: string) => void
  clear: () => void
  transparent?: boolean
}) {
  return (
    <>
      <label htmlFor="search" className="sr-only">
        Søk etter en artikkel
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Søk etter en artikkel"
        onReset={clear}
        className={`w-full max-w-lg h-12 px-4 py-2 text-lg rounded-sm border focus:outline-none focus:ring-2 ${transparent ? 'border-white focus:ring-white focus:text-white placeholder-white bg-transparent' : 'border-black focus:ring-black focus:text-black placeholder-black bg-white'}`}
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

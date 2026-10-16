import { useEffect, useRef, useState } from 'react'
import { Configure, Hits, InstantSearch, InstantSearchSSRProvider, useSearchBox } from 'react-instantsearch'
import { Link } from 'react-router'
import { useAlgoliaClient, useAlgoliaConfig, useAvailableFilter } from '~/hooks/useAlgolia'
import type { EggId } from '~/features/jule-egg/egg'
import { finnEgg } from '~/features/jule-egg/lager'
import { startSnofall } from '~/features/snofall/Snofall'
import { postUrl } from '~/lib/format'

/**
 * Jule-egg: noen søkeord gir et ekstra svar øverst i treffene. Noen av dem er også mobilvarianten
 * av egg man ellers taster, siden man ikke kan taste utenfor et tekstfelt på mobil.
 */
const HEMMELIGE_SOK: Record<string, { svar: string; egg: EggId; snofall?: 'ned' | 'opp' }> = {
  nisse: { svar: '🎅 Ho ho ho! Du fant meg.', egg: 'sok' },
  julenissen: { svar: '🎅 Ho ho ho! Du fant meg.', egg: 'sok' },
  hjelp: { svar: '🛠️ Har du prøvd å slå den av og på igjen?', egg: 'sok' },
  kristofer: { svar: '✍️ Han skriver for mye uansett.', egg: 'sok' },
  snø: { svar: '❄️ La det snø!', egg: 'sno', snofall: 'ned' },
  øns: { svar: '🙃 La det snø … oppover!', egg: 'sno-opp', snofall: 'opp' },
  hohoho: { svar: '🤖 Ho ho ho! Hils språkmodellene fra meg.', egg: 'sprakmodell' },
  'jul()': { svar: '🎄 Dette er ikke konsollen, men greit. God jul!', egg: 'konsoll', snofall: 'ned' },
}

type SearchProps = {
  transparent?: boolean
}

export const Search = ({ transparent = true }: SearchProps) => {
  const algoliaConfig = useAlgoliaConfig()
  const client = useAlgoliaClient()
  const availableFilter = useAvailableFilter()

  // Mangler konfigurasjonen (f.eks. når root-loaderen har feilet), viser vi ikke søk
  if (!algoliaConfig || !client) {
    return null
  }

  return (
    <InstantSearchSSRProvider>
      <InstantSearch
        searchClient={client}
        indexName={algoliaConfig.index}
        future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true }}
      >
        <SearchBoxWithDropdown transparent={transparent} />
        <Configure hitsPerPage={20} filters={availableFilter} />
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
    <div className="relative w-[75%] md:w-[500px] flex justify-center" ref={searchRef}>
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
        <div className="absolute top-full z-100 mt-1 w-full bg-white bg-opacity-90 shadow-lg rounded-lg max-h-[290px] overflow-y-scroll">
          <HemmeligTreff query={query} />
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
        // Nissene i nisseregn-spillet på venteskjermen kan løpe på søkefeltet
        data-nisse-flate
        id="search"
        type="search"
        value={query}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Søk etter en artikkel"
        onReset={clear}
        className={`w-full max-w-lg h-12 px-4 py-2 text-lg rounded-sm border focus:outline-hidden focus:ring-2 ${transparent ? 'border-red-berry focus:ring-red-berry focus:text-red-berry placeholder-red-berry bg-transparent' : 'border-black focus:ring-black focus:text-black placeholder-black bg-white'}`}
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

const HemmeligTreff = ({ query }: { query: string }) => {
  const hemmelig = HEMMELIGE_SOK[query.trim().toLowerCase()]

  useEffect(() => {
    if (!hemmelig) {
      return
    }
    if (hemmelig.snofall) {
      startSnofall(hemmelig.snofall)
    }
    finnEgg(hemmelig.egg)
  }, [hemmelig])

  return hemmelig ? <div className="px-4 py-3 border-b bg-soft-pink text-base text-black">{hemmelig.svar}</div> : null
}

import { ChevronDown, Sparkles } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { trackEvent } from 'utils/analytics'
import { getShortSummaryLabels, type ShortSummary as ShortSummaryType } from 'utils/summary/shortSummary'

type ShortSummaryProps = {
  summary: ShortSummaryType
  language: string | null
  slug: string
}

/** Høyden på det sammenslåtte panelet: to hele linjer og en tredje som fades ut */
const COLLAPSED_HEIGHT = '5.25rem'

/** «Kort fortalt» øverst i artikkelen, se utils/summary */
export const ShortSummary = ({ summary, language, slug }: ShortSummaryProps) => {
  const labels = getShortSummaryLabels(language)
  const contentId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  // Til vi har målt, antar vi at teksten er lang nok til å slås sammen, så siden
  // ikke hopper når skriptet lastes
  const [isCollapsible, setIsCollapsible] = useState(true)
  const [fullHeight, setFullHeight] = useState<number>()

  useEffect(() => {
    const content = contentRef.current
    if (!content) {
      return
    }
    const measure = () => {
      setFullHeight(content.scrollHeight)
      setIsCollapsible(content.scrollHeight > content.clientHeight + 1 || isExpanded)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => observer.disconnect()
  }, [isExpanded])

  const isCollapsed = isCollapsible && !isExpanded

  return (
    <aside aria-labelledby={`${contentId}-title`} className="mb-8 rounded-2xl bg-envelope-beige/35 px-5 py-4 sm:px-6">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${contentId}-title`} className="m-0 font-gt-expanded text-sm uppercase">
          {labels.title}
        </h2>
        {summary.isGenerated && (
          <span className="flex items-center gap-1 self-center text-xs text-reindeer-brown">
            <Sparkles aria-hidden className="size-3.5" />
            {labels.generated}
          </span>
        )}
      </div>
      <div
        id={contentId}
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        style={{
          maxHeight: isCollapsed ? COLLAPSED_HEIGHT : fullHeight ? `${fullHeight}px` : undefined,
          maskImage: isCollapsed ? 'linear-gradient(to bottom, black 55%, transparent)' : undefined,
        }}
        // Innholdet som er skjult, skal ikke kunne fokuseres eller leses opp før det vises
        inert={isCollapsed ? true : undefined}
      >
        <p className="leading-7">{summary.tldr}</p>
        {(summary.audience || summary.prerequisites) && (
          <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
            {summary.audience && (
              <>
                <dt className="font-bold">{labels.audience}</dt>
                <dd>{summary.audience}</dd>
              </>
            )}
            {summary.prerequisites && (
              <>
                <dt className="font-bold">{labels.prerequisites}</dt>
                <dd>{summary.prerequisites}</dd>
              </>
            )}
          </dl>
        )}
      </div>
      {isCollapsible && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => {
            if (!isExpanded) {
              trackEvent('short_summary_expanded', { slug })
            }
            setIsExpanded(!isExpanded)
          }}
          className="mt-2 flex items-center gap-1 text-sm underline underline-offset-4 hover:text-reindeer-brown"
        >
          {isExpanded ? labels.showLess : labels.showMore}
          <ChevronDown
            aria-hidden
            className={`size-4 transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </aside>
  )
}

import { getShortSummaryLabels, type ShortSummary as ShortSummaryType } from 'utils/summary/shortSummary'

type ShortSummaryProps = {
  summary: ShortSummaryType
  language: string | null
}

/** «Kort fortalt» øverst i artikkelen, se utils/summary */
export const ShortSummary = ({ summary, language }: ShortSummaryProps) => {
  const labels = getShortSummaryLabels(language)
  return (
    <aside aria-labelledby="short-summary-title" className="mb-8 rounded-2xl border-2 border-bekk-night p-5 sm:p-6">
      <h2 id="short-summary-title" className="mb-2 font-gt-expanded text-sm uppercase">
        {labels.title}
      </h2>
      <p className="leading-7">{summary.tldr}</p>
      {(summary.audience || summary.prerequisites) && (
        <dl className="mt-4 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          {summary.audience && (
            <>
              <dt className="font-bold">{labels.audience}</dt>
              <dd>{summary.audience}</dd>
            </>
          )}
          {summary.prerequisites && (
            <>
              <dt className="font-bold">{labels.prerequisites}</dt>
              <dd className="max-sm:mb-1">{summary.prerequisites}</dd>
            </>
          )}
        </dl>
      )}
      {summary.isGenerated && <p className="mt-4 text-xs opacity-70">{labels.generated}</p>}
    </aside>
  )
}

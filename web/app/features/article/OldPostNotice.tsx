import { History } from 'lucide-react'
import { parseIsoDate } from 'utils/calendar'
import type { POST_BY_SLUG_RESULT } from 'utils/sanity/types/sanity.types'

type PostType = NonNullable<POST_BY_SLUG_RESULT>['type']

const nouns: Record<string, Partial<Record<NonNullable<PostType>, string>> & { default: string }> = {
  'nb-NO': {
    article: 'Denne artikkelen',
    podcast: 'Denne podkasten',
    video: 'Denne videoen',
    default: 'Dette innlegget',
  },
  'nn-NO': {
    article: 'Denne artikkelen',
    podcast: 'Denne podkasten',
    video: 'Denne videoen',
    default: 'Dette innlegget',
  },
  'en-US': { article: 'This article', podcast: 'This podcast', video: 'This video', default: 'This post' },
}

const messages: Record<string, (noun: string, year: number) => string> = {
  'nb-NO': (noun, year) => `${noun} er fra julekalenderen i ${year}, så noe av innholdet kan være utdatert.`,
  'nn-NO': (noun, year) => `${noun} er frå julekalenderen i ${year}, så noko av innhaldet kan vere utdatert.`,
  'en-US': (noun, year) => `${noun} is from the ${year} Christmas calendar, so some of it may be out of date.`,
}

type OldPostNoticeProps = {
  availableFrom: string
  type: PostType
  language: string | null
}

/** Varsel øverst i gamle innlegg, se `isOldPost` i utils/calendar */
export const OldPostNotice = ({ availableFrom, type, language }: OldPostNoticeProps) => {
  const lang = language && language in messages ? language : 'nb-NO'
  const noun = (type && nouns[lang][type]) || nouns[lang].default
  return (
    <p role="note" className="mb-6 flex items-start gap-2 text-sm text-reindeer-brown">
      <History aria-hidden className="mt-0.5 size-4 shrink-0" />
      {messages[lang](noun, parseIsoDate(availableFrom).year)}
    </p>
  )
}

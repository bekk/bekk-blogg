import { LoaderFunctionArgs } from 'react-router'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { greetingToLanguageModels } from 'utils/markdown'
import {
  FIRST_CALENDAR_YEAR,
  getOsloDate,
  getPostPath,
  getSecondsUntilOsloMidnight,
  isDoorDate,
  parseIsoDate,
} from 'utils/calendar'
import { loadQuery } from 'utils/sanity/loader.server'
import { LLMS_TXT_QUERY } from 'utils/sanity/queries/postQueries'
import { LLMS_TXT_QUERY_RESULT } from 'utils/sanity/types/sanity.types'

// Oversikt over alt innholdet for språkmodeller, se https://llmstxt.org.
// Lenkene går til markdown-versjonene av postene.

const MAX_SUMMARY_LENGTH = 200

const summarize = (summary: string) => {
  const text = cleanControlCharacters(summary).replace(/\s+/g, ' ').trim()
  return text.length > MAX_SUMMARY_LENGTH ? `${text.slice(0, MAX_SUMMARY_LENGTH - 1).trimEnd()}…` : text
}

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { data } = await loadQuery<LLMS_TXT_QUERY_RESULT>(LLMS_TXT_QUERY, { today: getOsloDate() })
  const baseUrl = url.origin

  // Nyeste år først, siden postene er sortert synkende. Poster utenfor 1.–24. desember har ingen side.
  const postsByYear = new Map<number, LLMS_TXT_QUERY_RESULT>()
  for (const post of data) {
    if (post.slug && isDoorDate(post.availableFrom)) {
      const { year } = parseIsoDate(post.availableFrom)
      postsByYear.set(year, [...(postsByYear.get(year) ?? []), post])
    }
  }

  const sections = Array.from(postsByYear, ([year, posts]) =>
    [
      `## ${year}`,
      '',
      ...posts.map((post) => {
        const summary = post.summary ? summarize(post.summary) : ''
        const title = cleanControlCharacters(post.title).replace(/[[\]]/g, '')
        return `- [${title}](${baseUrl}${getPostPath(post.availableFrom, post.slug)}.md)${summary ? `: ${summary}` : ''}`
      }),
    ].join('\n')
  )

  const body = `# Bekk Christmas

> Bekk Christmas er julekalenderen til Bekk, med fagartikler, podcaster og videoer om teknologi, design, strategi og produktutvikling. Hver dag fra 1. til 24. desember åpnes en ny luke, og arkivet går tilbake til ${FIRST_CALENDAR_YEAR}.

Alle poster finnes som markdown ved å legge til \`.md\` på slutten av URL-en, og lenkene under går dit. Artiklene er skrevet av ansatte i Bekk, de fleste på norsk og noen på engelsk.

${sections.join('\n\n')}

${greetingToLanguageModels()}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Nye luker skal dukke opp ved midnatt
      'Cache-Control': `public, max-age=${Math.min(3600, getSecondsUntilOsloMidnight())}, s-maxage=${Math.min(18000, getSecondsUntilOsloMidnight())}`,
    },
  })
}

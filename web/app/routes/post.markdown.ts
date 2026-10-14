import { LoaderFunctionArgs } from 'react-router'
import { getOsloDate, getPostPath } from 'utils/calendar'
import { assertDoorIsOpen, assertPostBelongsToDoor } from 'utils/doors.server'
import { postToMarkdown } from 'utils/markdown'
import { loadQuery } from 'utils/sanity/loader.server'
import { POST_MARKDOWN_BY_SLUG } from 'utils/sanity/queries/postQueries'
import { POST_MARKDOWN_BY_SLUG_RESULT } from 'utils/sanity/types/sanity.types'
import { SITE_URL } from 'utils/site'
import { z } from 'zod'

// Markdown-versjon av en post, på samme URL som artikkelen med `.md` på slutten.
// Gjør innholdet lett å lese for språkmodeller og andre maskiner. Bare publisert
// innhold i åpne luker, akkurat som artikkelsiden.

const ParamsSchema = z.object({
  year: z.string().length(4),
  date: z.string().length(2),
  slug: z.string().min(1),
})

/** Headere tåler ikke tegn utenfor Latin-1, så URL-en må være prosentkodet */
function toHeaderSafeUrl(url: string | null) {
  try {
    return url ? new URL(url).href : null
  } catch {
    return null
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', { status: 400, headers: { 'Cache-Control': 'no-cache, no-store' } })
  }
  const { year, date, slug } = parsedParams.data
  const today = getOsloDate()

  assertDoorIsOpen(year, date, today)
  const { data: post } = await loadQuery<POST_MARKDOWN_BY_SLUG_RESULT>(POST_MARKDOWN_BY_SLUG, { slug })
  assertPostBelongsToDoor(post, year, date)

  const postUrl = `${SITE_URL}${getPostPath(post.availableFrom, post.slug)}`
  const markdown = postToMarkdown(post, postUrl)

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Søkemotorer skal indeksere HTML-versjonen, ikke denne
      Link: `<${toHeaderSafeUrl(post.canonicalUrl) ?? postUrl}>; rel="canonical"`,
      // Samme som artikkelsiden, så rettelser kommer raskt ut i begge versjoner
      'Cache-Control': 'public, max-age=10, stale-while-revalidate=2592000, stale-if-error=2592000',
    },
  })
}

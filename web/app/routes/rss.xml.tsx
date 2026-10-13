import { LoaderFunctionArgs } from 'react-router'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { getOsloDate, isDoorDate, getSecondsUntilOsloMidnight, parseIsoDate } from 'utils/calendar'
import { loadQuery } from 'utils/sanity/loader.server'
import { RSS_FEED_QUERY } from 'utils/sanity/queries/postQueries'
import { RSS_FEED_QUERY_RESULT } from 'utils/sanity/types/sanity.types'

/** CDATA-seksjoner kan ikke inneholde `]]>`, så den deles opp */
const cdata = (value: string) => `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { data: posts } = await loadQuery<RSS_FEED_QUERY_RESULT>(RSS_FEED_QUERY, { today: getOsloDate() })
  const baseUrl = url.origin

  const rssString = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Bekk Christmas</title>
    <description>Bekk Christmas er en julekalender med innhold om teknologi, design, strategi og produktutvikling fra Bekk</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>nb-NO</language>
    ${posts
      // Poster utenfor 1.–24. desember har ingen side
      .filter((post) => isDoorDate(post.availableFrom))
      .map((post) => {
        const { year, day } = parseIsoDate(post.availableFrom)
        const postDate = new Date(post.availableFrom).toUTCString()
        const postUrl = `${baseUrl}/post/${year}/${String(day).padStart(2, '0')}/${encodeURIComponent(post.slug ?? '')}`

        const description = cleanControlCharacters(post.description ?? '')

        const content = post.type === 'article' ? post.content : description

        return `
    <item>
      <title>${cdata(cleanControlCharacters(post.title ?? ''))}</title>
      <description>${cdata(description)}</description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${postDate}</pubDate>
      ${post.authors?.map((author) => `<dc:creator>${cdata(author)}</dc:creator>`).join('\n      ') ?? ''}
      <content:encoded>${cdata(content ?? '')}</content:encoded>
    </item>`
      })
      .join('\n')}
  </channel>
</rss>`

  return new Response(rssString, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rssString)),
      // Nye luker skal dukke opp i feeden ved midnatt
      'Cache-Control': `public, max-age=${Math.min(3600, getSecondsUntilOsloMidnight())}, s-maxage=${Math.min(18000, getSecondsUntilOsloMidnight())}`,
    },
  })
}

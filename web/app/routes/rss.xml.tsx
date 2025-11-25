import { LoaderFunctionArgs } from 'react-router'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { loadQuery } from 'utils/sanity/loader.server'
import { RSS_FEED_QUERY } from 'utils/sanity/queries/postQueries'
import { RSS_FEED_QUERYResult } from 'utils/sanity/types/sanity.types'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data: posts } = await loadQuery<RSS_FEED_QUERYResult>(RSS_FEED_QUERY)
  const baseUrl = new URL(request.url).origin

  const rssString = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Bekk Christmas</title>
    <description>Bekk Christmas er en julekalender med innhold om teknologi, design, strategi og produktutvikling fra Bekk</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>nb-NO</language>
    ${posts
      .map((post) => {
        const postDate = new Date(post.availableFrom).toUTCString()
        const postUrl = `${baseUrl}/post/${new Date(post.availableFrom).getFullYear()}/${new Date(post.availableFrom)
          .getDate()
          .toString()
          .padStart(2, '0')}/${post.slug}`

        const description = cleanControlCharacters(post.description ?? '')

        const content = post.type === 'article' ? post.content : description

        return `
    <item>
      <title><![CDATA[${cleanControlCharacters(post.title ?? '')}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${postDate}</pubDate>
      ${post.authors?.map((author) => `<author>${author}</author>`).join('\n      ')}
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`
      })
      .join('\n')}
  </channel>
</rss>`

  return new Response(rssString, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rssString)),
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  })
}

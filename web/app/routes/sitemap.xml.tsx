import { LoaderFunctionArgs } from 'react-router'
import { getOsloDate, isDoorDate, parseIsoDate } from 'utils/calendar'
import { loadQuery } from 'utils/sanity/loader.server'
import { SITEMAP_QUERY } from 'utils/sanity/queries/postQueries'
import { SITEMAP_QUERY_RESULT } from 'utils/sanity/types/sanity.types'

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { data } = await loadQuery<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY, { today: getOsloDate() })
  // Poster utenfor 1.–24. desember har ingen side
  const posts = data.posts.filter((post) => isDoorDate(post.availableFrom))
  const baseUrl = url.origin

  const postPath = (availableFrom: string) => {
    const { year, day } = parseIsoDate(availableFrom)
    return `/post/${year}/${String(day).padStart(2, '0')}`
  }
  const years = new Set(posts.map((post) => parseIsoDate(post.availableFrom).year))
  // Bare dager som faktisk har innhold, ikke alle kombinasjoner av år og dag
  const dayPaths = new Set(posts.map((post) => postPath(post.availableFrom)))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${Array.from(years)
        .map(
          (year) => `
        <url>
          <loc>${baseUrl}/post/${year}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}
      ${Array.from(dayPaths)
        .map(
          (path) => `
        <url>
          <loc>${baseUrl}${path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}
      ${posts
        .map((post) => {
          return `
        <url>
          <loc>${baseUrl}${postPath(post.availableFrom)}/${encodeURIComponent(post.slug ?? '')}</loc>
          <lastmod>${new Date(post._updatedAt).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`
        })
        .join('')}
      ${data.authors
        .map(
          (author) => `
        <url>
          <loc>${baseUrl}/forfatter/${encodeURIComponent(author.slug ?? '')}</loc>
          <lastmod>${new Date(author._updatedAt).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`
        )
        .join('')}
      ${data.tags
        .map(
          (tag) => `
        <url>
          <loc>${baseUrl}/kategori/${encodeURIComponent(tag.slug ?? '')}</loc>
          <lastmod>${new Date(tag._updatedAt).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`
        )
        .join('')}
    </urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

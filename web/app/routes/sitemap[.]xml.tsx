import { LoaderFunctionArgs } from '@remix-run/node'
import { SITEMAP_QUERY } from 'utils/sanity/queries/postQueries'
import { loadQuery } from 'utils/sanity/store'
import { SITEMAP_QUERYResult } from 'utils/sanity/types/sanity.types'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data } = await loadQuery<SITEMAP_QUERYResult>(SITEMAP_QUERY)
  const baseUrl = new URL(request.url).origin

  const years = new Set(data.posts.map((post) => new Date(post.availableFrom).getFullYear()))
  const days = new Set(data.posts.map((post) => new Date(post.availableFrom).getDate()))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.schemaxs.org/sitemap/0.9">
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
      ${Array.from(years)
        .map((year) =>
          Array.from(days)
            .map(
              (day) => `
        <url>
          <loc>${baseUrl}/post/${year}/${day}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
            )
            .join('')
        )
        .join('')}
      ${data.posts
        .map((post) => {
          const date = new Date(post.availableFrom)
          return `
        <url>
          <loc>${baseUrl}/post/${date.getFullYear()}/${date.getDate()}/${post.slug}</loc>
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
          <loc>${baseUrl}/forfatter/${author.slug}</loc>
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
          <loc>${baseUrl}/kategori/${tag.slug}</loc>
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

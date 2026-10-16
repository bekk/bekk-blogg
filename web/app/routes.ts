import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/index.tsx'),
  route('arkiv', 'routes/arkiv.tsx'),
  route('category/:tag', 'routes/category.$tag.tsx'),
  route('kategori/:tag', 'routes/kategori.$tag.tsx'),
  route('kategori', 'routes/kategori.tsx'),
  route('forfatter/:name', 'routes/forfatter.$name.tsx'),
  route('post/:year', 'routes/post.$year.tsx'),
  route('post/:year/:date', 'routes/post.$year.$date.tsx'),
  // Må stå før artikkelruten, siden `:slug` ellers også matcher `.md`
  route('post/:year/:date/:slug.md', 'routes/post.markdown.ts'),
  route('post/:year/:date/:slug', 'routes/post.$year.$date.$slug.tsx'),
  route('skjerm', 'routes/screen.tsx'),
  route('resource/preview', 'routes/resource.preview.tsx'),
  // Matcher både /studio og alle understier, som Studioet ruter selv
  route('studio/*', 'routes/studio.tsx'),
  route('julesveiper', 'routes/julesveiper.tsx'),
  // Oversikt over easter eggene, som ikke lenkes til fra noe sted
  route('jule-egg', 'routes/jule-egg.tsx'),
  route('rss.xml', 'routes/rss.xml.tsx'),
  route('feed.xml', 'routes/rss.xml.tsx', { id: 'feed' }),
  route('sitemap.xml', 'routes/sitemap.xml.tsx'),
  route('llms.txt', 'routes/llms.txt.ts'),
  route('api/webhook/sanity', 'routes/api.webhook.sanity.ts'),
  route('api/webhook/review', 'routes/api.webhook.review.ts'),
  route('api/newsletter', 'routes/api.newsletter.ts'),
] satisfies RouteConfig

import { type LoaderFunctionArgs, type MetaFunction, redirect } from '@remix-run/node'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'

import { TeaserPage } from '~/features/teaser/TeaserPage'

export const meta: MetaFunction = () => {
  return [
    { title: 'bekk.christmas' },
    {
      name: 'description',
      content:
        'Bekk Christmas er en julekalender med innhold om teknologi, design, strategi og produktutvikling fra Bekk',
    },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { preview } = await loadQueryOptions(request.headers)
  const liveDate = new Date('2024-12-01')
  const now = new Date()
  const isLive = now > liveDate
  if (preview || isLive) {
    return redirect('/post/2024')
  }
  return null
}

export default function Index() {
  return <TeaserPage />
}

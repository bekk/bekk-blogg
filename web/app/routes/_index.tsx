import { type LoaderFunctionArgs, type MetaFunction, redirect } from '@remix-run/node'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'

import { TeaserPage } from '~/features/teaser/TeaserPage'

export const meta: MetaFunction = () => {
  return [{ title: 'bekk.christmas' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { preview } = await loadQueryOptions(request.headers)
  const liveDate = new Date('2024-12-01')
  const now = new Date()
  const isLive = now > liveDate
  if (preview || isLive) {
    return redirect('/2024')
  }
}

export default function Index() {
  return (
    <main id="content">
      <TeaserPage />
    </main>
  )
}

import type { MetaFunction } from '@remix-run/node'

import { TeaserPage } from '~/features/teaser/TeaserPage'

export const meta: MetaFunction = () => {
  return [{ title: 'bekk.christmas' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  return (
    <main id="content">
      <TeaserPage />
    </main>
  )
}

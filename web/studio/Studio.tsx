import { Studio } from 'sanity'

import config from './sanity.config'

export default function StudioApp() {
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={config} />
    </div>
  )
}

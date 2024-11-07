import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'bekk.christmas' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  return (
    <main id="content" className="p-8">
      <h1>bekk.christmas</h1>
      <h2 className="text-reindeer-brown">Her kan du få noe å bryne deg på..</h2>
    </main>
  )
}
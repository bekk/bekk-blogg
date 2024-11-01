import type { MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}



export default function Index() {
  return(
    <main id="content">
      <h1>Halla</h1>
      <p className='font-gt-standard-italic'>Her kommer det masse tekst.</p>
      <p className='font-gt-standard-light text-xl'>Keynote: har vi glemt føkkings smidig?</p>
      <Button variant='outline'>Klikk</Button>
      <p className='font-delicious text-2xl'>Hallo</p>
    </main>
  )
}

import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  const title = `Fant ikke den siden`
  const description = `Her ser det ut som du har gått deg vill i julekalenderen!`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
  ]
}

export const Page404 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center p-10 pt-14 gap-6 md:p-40 md:gap-8">
      <h1>Oi, det ser ut som du har gått deg vill i julekalenderen!</h1>
      <h2>
        Denne siden finnes ikke, men fortvil ei - det er mange andre luker å åpne. Kanskje nissen kan hjelpe deg
        tilbake? 🎅
      </h2>
    </div>
  )
}

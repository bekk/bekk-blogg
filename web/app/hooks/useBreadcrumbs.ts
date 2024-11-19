import { useMatches } from '@remix-run/react'

export type Breadcrumb = {
  href: string
  title: string
}

export function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches().filter((match) => match.id !== 'root')
  const currRoute = matches[matches.length - 1]
  const breadcrumbs: Breadcrumb[] = []
  let accumulatedPath = ''

  Object.keys(currRoute.params).map((key) => {
    accumulatedPath += `${currRoute.params[key]}`

    let title = ''

    if (key === 'year') {
      if (currRoute.params.year && new Date(new Date().setFullYear(parseInt(currRoute.params.year))) < new Date()) {
        title = `📯 ${currRoute.params.year}`
      } else {
        title = '📯 Postkontoret'
      }
    } else if (key === 'date') {
      let date = currRoute.params.date
      if (date && parseInt(date) < 10) {
        date = date.replace('0', '')
      }
      title = `📬 ${date}. des`
    } else if (key === 'slug' && currRoute.data) {
      title = `💌 ${(currRoute.data as { title?: string })?.title ?? '💌 Innlegg'}`
    }

    breadcrumbs.push({
      href: accumulatedPath,
      title: title,
    })
  })
  return breadcrumbs
}

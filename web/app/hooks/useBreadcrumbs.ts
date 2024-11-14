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

  if (currRoute.pathname !== '/') {
    breadcrumbs.push({
      href: '/',
      title: 'Hjem',
    })
  }

  Object.keys(currRoute.params).map((key) => {
    accumulatedPath += `/${currRoute.params[key]}`
    const title = currRoute.params[key]

    breadcrumbs.push({
      href: accumulatedPath,
      title: `${title}`,
    })
  })
  return breadcrumbs
}

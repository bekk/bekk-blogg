import { useMatches } from '@remix-run/react'

export type Breadcrumb = {
  href: string
  title: string
}

export function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches().filter((match) => match.id !== 'root')
  const currRoute = matches[matches.length - 1]
  console.log('currRoute', currRoute)

  let accumulatedPath = ''
  const breadcrumbs = Object.keys(currRoute.params).map((key) => {
    accumulatedPath += `/${currRoute.params[key]}`
    return {
      href: accumulatedPath,
      title: `${currRoute.params[key]}`,
    }
  })

  console.log('============= BREADCRUMBS =============')
  console.log(breadcrumbs)

  return breadcrumbs
}

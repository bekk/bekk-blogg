import { useMatches } from '@remix-run/react'

export type Breadcrumb = {
  href: string
  title: string
}

export function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches().filter((match) => match.id !== 'root')
  const currRoute = matches[matches.length - 1]

  let accumulatedPath = ''
  const breadcrumbs = Object.keys(currRoute.params).map((key) => {
    accumulatedPath += `/${currRoute.params[key]}`
    const title = currRoute.params[key]

    return {
      href: accumulatedPath,
      title: `${title}`,
    }
  })

  return breadcrumbs
}

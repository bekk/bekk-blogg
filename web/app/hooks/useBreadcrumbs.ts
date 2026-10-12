import { useMatches, useRouteLoaderData } from 'react-router'

import type { loader as rootLoader } from '~/root'

import { Author, Post } from '../../utils/sanity/types/sanity.types'

export type Breadcrumb = {
  href?: string
  title: string
}

export function useBreadcrumbs(): Breadcrumb[] {
  const rootData = useRouteLoaderData<typeof rootLoader>('root')
  const latestCalendarYear = rootData?.latestCalendarYear
  const mailroomHref = latestCalendarYear ? `/post/${latestCalendarYear}` : '/'
  const matches = useMatches().filter((match) => match.id !== 'root')
  if (matches.length === 0) {
    return []
  }
  const currRoute = matches[matches.length - 1]
  const breadcrumbs: Breadcrumb[] = []
  let accumulatedPath = ''

  const addBreadcrumb = (path: string, title: string) => {
    accumulatedPath += path
    breadcrumbs.push({ href: accumulatedPath, title })
  }

  if (currRoute.pathname.includes('/post/')) {
    accumulatedPath += '/post'
    Object.keys(currRoute.params).map((key) => {
      accumulatedPath += `/${currRoute.params[key]}`

      let title = ''
      if (key === 'year') {
        if (currRoute.params.year && latestCalendarYear && parseInt(currRoute.params.year) <= latestCalendarYear) {
          title = `${currRoute.params.year}`
        } else {
          title = 'Postkontoret'
        }
      } else if (key === 'date') {
        let date = currRoute.params.date
        if (date && parseInt(date) < 10) {
          date = date.replace('0', '')
        }
        title = `${date}. desember`
      } else if (key === 'slug' && currRoute.loaderData) {
        const postTitle = (currRoute.loaderData as { initial: { data: Post } }).initial.data?.title
        title = `${postTitle ?? ' Innlegg'}`
      }

      breadcrumbs.push({
        href: accumulatedPath,
        title: title,
      })
    })
  } else if (currRoute.pathname.includes('/kategori')) {
    breadcrumbs.unshift({
      href: mailroomHref,
      title: 'Postkontoret',
    })
    addBreadcrumb('/kategori', 'Kategorier')
    Object.entries(currRoute.params).forEach(([key, value]) => {
      if (key === 'tag' && value && currRoute.loaderData) {
        const tagName = (currRoute.loaderData as { tag: { name: string } }).tag.name
        addBreadcrumb(`/${value}`, `${tagName.charAt(0).toUpperCase() + tagName.slice(1)}`)
      }
    })
  } else if (currRoute.pathname.includes('/forfatter')) {
    addBreadcrumb(mailroomHref, 'Postkontoret')
    const match = matches[matches.length - 1]?.loaderData as { author: Author }
    if (match?.author?.fullName) {
      addBreadcrumb('', `${match?.author?.fullName}`)
    }
  }
  return breadcrumbs
}

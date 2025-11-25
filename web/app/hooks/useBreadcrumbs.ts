import { useMatches } from 'react-router'

import { Author, Post } from '../../utils/sanity/types/sanity.types'

export type Breadcrumb = {
  href?: string
  title: string
}

export function useBreadcrumbs(): Breadcrumb[] {
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
        if (currRoute.params.year && new Date(new Date().setFullYear(parseInt(currRoute.params.year))) < new Date()) {
          title = `${currRoute.params.year}`
        } else {
          title = 'Postkontoret'
        }
      } else if (key === 'date') {
        let date = currRoute.params.date
        if (date && parseInt(date) < 10) {
          date = date.replace('0', '')
        }
        title = `${date}. des`
      } else if (key === 'slug' && currRoute.data) {
        const postTitle = (currRoute.data as { initial: { data: Post } }).initial.data?.title
        title = `${postTitle ?? ' Innlegg'}`
      }

      breadcrumbs.push({
        href: accumulatedPath,
        title: title,
      })
    })
  } else if (currRoute.pathname.includes('/kategori')) {
    breadcrumbs.unshift({
      href: '/post/2024',
      title: 'Postkontoret',
    })
    addBreadcrumb('/kategori', 'Kategorier')
    Object.entries(currRoute.params).forEach(([key, value]) => {
      if (key === 'tag' && value && currRoute.data) {
        const tagName = (currRoute.data as { tag: { name: string } }).tag.name
        addBreadcrumb(`/${value}`, `${tagName.charAt(0).toUpperCase() + tagName.slice(1)}`)
      }
    })
  } else if (currRoute.pathname.includes('/forfatter')) {
    addBreadcrumb('/post/2024', 'Postkontoret')
    const match = matches[matches.length - 1]?.data as { author: Author }
    if (match?.author?.fullName) {
      addBreadcrumb('', `${match?.author?.fullName}`)
    }
  }
  return breadcrumbs
}

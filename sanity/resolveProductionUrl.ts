import {SanityDocumentLike, Slug} from 'sanity'

const remoteUrl = 'https://bekk-blogg.vercel.app'
const localUrl = 'http://localhost:5173'

export default function resolveProductionUrl(document: SanityDocumentLike) {
  const isLocalhost = window.location.hostname === 'localhost'
  const baseUrl = isLocalhost ? localUrl : remoteUrl

  const previewUrl = baseUrl + getUrlForDocument(document) + '?preview=true'
  return previewUrl.toString()
}

function getUrlForDocument(doc: SanityDocumentLike) {
  switch (doc._type) {
    case 'post':
      return getUrlForPost(doc)
    case 'page':
      return getUrlForPage(doc)
    default:
      return ''
  }
}

function getUrlForPost(doc: SanityDocumentLike & {slug?: Slug; availableFrom?: string}) {
  if (!doc?.slug?.current || !doc?.availableFrom) {
    return '/'
  }
  const slug = doc.slug as Slug
  const date = doc.availableFrom as string
  const {day, year} = toDayYear(date)
  return `/${year}/${day}/${slug.current}`
}

const getUrlForPage = (doc: SanityDocumentLike) => {
  const slug = doc?.slug as Slug
  return `/${slug?.current ?? ''}`
}

const toDayYear = (date: string) => ({
  day: date.split('-')[2],
  year: date.split('-')[0],
})

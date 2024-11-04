import {at, defineMigration, setIfMissing} from 'sanity/migrate'

import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_SESSION_API_TOKEN,
  useCdn: false,
})

async function getAnonymAuthorId() {
  const authors = await client.fetch(`*[_type == "author" && fullName == "Anonym"]{_id}`)
  if (authors.length === 0) {
    throw new Error('No author found with fullName "Anonym".')
  }
  return authors[0]._id
}

let anonymAuthorId: any
getAnonymAuthorId().then((id) => (anonymAuthorId = id))

export default defineMigration({
  title: 'Make authors field in post required',

  migrate: {
    document(doc, context) {
      if (doc._type === 'post') {
        const defaultAuthor = {_type: 'reference', _ref: anonymAuthorId}
        return at('authors', setIfMissing([defaultAuthor]))
      }
    },
  },
})

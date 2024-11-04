import {at, defineMigration, setIfMissing, unset} from 'sanity/migrate'

import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'ah2n1vfr',
  dataset: 'bekk-blogg',
  apiVersion: 'v2021-08-21',
  token:
    'skNTFZFBibQiRXCuwV4hKLLQ9d4rYhk5j7mddpbiD3YkDVFtaBIjDnp68ZTHRH7SsBRZwHC8k8TbFlkGH8hmRHD9EGFtDr0I2aQTdHXRJAf6lq19gDUY7ZbAJGAtayirwyKnpIJ7cJispikMfbuW73oUGocXgo9zVihwybTk08xvUmZwX37n',
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
    document(doc) {
      if (doc._type === 'post') {
        const defaultAuthor = {_type: 'reference', _ref: anonymAuthorId}
        return at('authors', setIfMissing([defaultAuthor]))
      }
    },
  },
})

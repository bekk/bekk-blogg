import { at, defineMigration, setIfMissing } from 'sanity/migrate'

export default defineMigration({
  title: 'Make authors field in post required',
  documentTypes: ['post'],

  migrate: {
    document() {
      const anonymousAuthorId = process.env.ANONYM_AUTHOR_ID
      if (!anonymousAuthorId) {
        // Uten id ville migreringen skrevet `_ref: undefined` inn i alle poster
        throw new Error('Missing ANONYM_AUTHOR_ID in .env.local')
      }
      const defaultAuthor = { _type: 'reference', _ref: anonymousAuthorId }
      return at('authors', setIfMissing([defaultAuthor]))
    },
  },
})

import {at, defineMigration, setIfMissing} from 'sanity/migrate'

export default defineMigration({
  title: 'Make authors field in post required',

  migrate: {
    document(doc, context) {
      if (doc._type === 'post') {
        const defaultAuthor = {_type: 'reference', _ref: process.env.ANONYM_AUTHOR_ID}
        return at('authors', setIfMissing([defaultAuthor]))
      }
    },
  },
})

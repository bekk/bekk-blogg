import {at, defineMigration, patch, setIfMissing} from 'sanity/migrate'
import slugify from 'slugify'

/**
 * this migration will set `slug` on all authors that are missing a slug
 */
export default defineMigration({
  title: 'Add missing slug on authors',
  documentTypes: ['author'],

  async *migrate(documents) {
    for await (const document of documents()) {
      const authorName = document.fullName
      if (authorName && !document.slug) {
        console.log('Missing slug for author:', authorName)
        const authorSlug = slugify(authorName.toString(), {lower: true, strict: true, trim: true})
        yield patch(document._id, [at('slug.current', setIfMissing(authorSlug))])
      }
    }
  },
})

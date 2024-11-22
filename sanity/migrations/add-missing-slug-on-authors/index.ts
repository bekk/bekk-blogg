import { at, defineMigration, patch, setIfMissing } from 'sanity/migrate'
import slugify from 'slugify'

/**
 * this migration will set `Default title` on all documents that are missing a title
 * and make `true` the default value for the `enabled` field
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

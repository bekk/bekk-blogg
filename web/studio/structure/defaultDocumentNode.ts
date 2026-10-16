import DocumentsPane from 'sanity-plugin-documents-pane'
import type { DefaultDocumentNodeResolver } from 'sanity/structure'

import { ReviewView } from './ReviewView'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  switch (schemaType) {
    case `author`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "post" && references($id)]`,
            params: { id: `_id` },
            options: { perspective: 'drafts' },
          })
          .title('Innlegg av denne forfatteren'),
      ])
    case 'tag':
      return S.document().views([
        S.view.form(),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "post" && references($id)]`,
            params: { id: `_id` },
            options: { perspective: 'drafts' },
          })
          .title('Innlegg i denne kategorien'),
      ])
    case 'post':
      return S.document().views([
        S.view.form(),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "postSummary" && references($id)]`,
            params: { id: `_id` },
          })
          .title('Kort fortalt (AI)'),
        S.view.component(ReviewView).title('Tilbakemelding (AI)'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}

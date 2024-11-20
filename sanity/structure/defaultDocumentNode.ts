import type {DefaultDocumentNodeResolver} from 'sanity/structure'
import DocumentsPane from 'sanity-plugin-documents-pane'
import {Iframe} from 'sanity-plugin-iframe-pane'
import {SanityDocument} from 'sanity'
import resolveProductionUrl from '../resolveProductionUrl'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case `author`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "post" && references($id)]`,
            params: {id: `_id`},
            options: {perspective: 'previewDrafts'},
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
            params: {id: `_id`},
            options: {perspective: 'previewDrafts'},
          })
          .title('Innlegg i denne kategorien'),
      ])
    case 'post':
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: SanityDocument) => resolveProductionUrl(doc),
          })
          .title('Preview'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}

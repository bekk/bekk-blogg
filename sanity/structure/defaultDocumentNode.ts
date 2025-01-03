import DocumentsPane from 'sanity-plugin-documents-pane'
import type {DefaultDocumentNodeResolver} from 'sanity/structure'

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
    default:
      return S.document().views([S.view.form()])
  }
}

import {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/desk'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'post':
      return S.document().views([S.view.form()])
    default:
      return S.document().views([S.view.form()])
  }
}

const structureResolver: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post'),
      S.documentTypeListItem('author'),
      S.documentTypeListItem('tag'),
      S.documentTypeListItem('page'),
    ])

export default structureResolver

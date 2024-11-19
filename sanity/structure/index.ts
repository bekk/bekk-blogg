import {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Alle innlegg'),
      S.documentTypeListItem('author').title('Forfattere'),
      S.documentTypeListItem('tag').title('Kategorier'),
    ])

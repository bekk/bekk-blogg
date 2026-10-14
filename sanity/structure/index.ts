import {StructureResolver} from 'sanity/structure'

import {contextDocumentTypeName} from '@sanity/assist'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Alle innlegg'),
      S.documentTypeListItem('author').title('Forfattere'),
      S.documentTypeListItem('tag').title('Kategorier'),
      S.documentTypeListItem('series').title('Serier'),
      S.divider(),
      S.documentTypeListItem(contextDocumentTypeName).title('AI-kontekst'),
    ])

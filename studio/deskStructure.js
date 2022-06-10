// ./studio/deskStructure.js

import S from '@sanity/desk-tool/structure-builder'
import Iframe from 'sanity-plugin-iframe-pane'
import { FaHome } from "react-icons/fa";
import resolveProductionUrl from './resolveProductionUrl'

export const getDefaultDocumentNode = () => {
  return S.document().views([
    S.view.form(),
    S.view
      .component(Iframe)
      .options({
        url: (doc) => resolveProductionUrl(doc),
      })
      .title('Preview'),
  ])
}

export default () =>
  S.list()
    .title('Content')         
    .items([
      S.listItem()
        .title('Home Page')
        .icon(FaHome)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .views([
              S.view.form(),
              S.view
                .component(Iframe)
                .options({
                  url: (doc) => resolveProductionUrl(doc),
                })
                .title('Preview'),
            ])
        ),
        ...S.documentTypeListItems().filter(listItem => !['homepage'].includes(listItem.getId()))
    ])
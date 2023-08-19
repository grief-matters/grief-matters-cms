import { StructureResolver } from "sanity/desk";

import {
  documentTypes,
  internetResourceDocumentTypes,
  singletonDocumentTypes,
} from "../schemas";

import { startCase } from "lodash";
import pluralize from "pluralize";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      ...singletonDocumentTypes.map((t) =>
        S.listItem()
          .title(startCase(t.title ?? t.name))
          .id(`${t.type}-singleton`)
          .icon(t.icon)
          .child(
            S.document().schemaType(t.name).documentId(`${t.type}-singleton`)
          )
      ),
      S.divider(),
      ...documentTypes.map((t) =>
        S.documentTypeListItem(t.name).title(
          startCase(pluralize(t.title ?? t.name))
        )
      ),
      S.divider(),
      ...internetResourceDocumentTypes.map((t) =>
        S.documentTypeListItem(t.name).title(
          startCase(pluralize(t.title ?? t.name))
        )
      ),
    ]);

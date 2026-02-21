import { StructureResolver } from "sanity/structure";

import {
  documentTypes,
  internetResourceDocumentTypes,
  singletonDocumentTypes,
} from "../schemas";

import { startCase } from "lodash";
import pluralize from "pluralize";
import { BookIcon } from "@sanity/icons";
import { docs } from "./documentation/docs";
import { DocumentationPane } from "./documentation/DocumentationPane";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      ...singletonDocumentTypes.map((t) =>
        S.listItem()
          .title(startCase(t.title ?? t.name))
          .id(`${t.name}-singleton`)
          .icon(t.icon)
          .child(
            S.document().schemaType(t.name).documentId(`${t.name}-singleton`)
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
      S.divider(),
      S.listItem()
        .title("Documentation")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Documentation")
            .items(
              docs.map((doc) =>
                S.listItem()
                  .title(doc.title)
                  .icon(BookIcon)
                  .child(
                    S.component(DocumentationPane)
                      .title(doc.title)
                      .options({ documentId: doc.id })
                  )
              )
            )
        ),
    ]);

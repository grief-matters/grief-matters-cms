import type { StructureResolver } from "sanity/structure";

import {
  classificationDocumentTypes,
  documentTypes,
  internetResourceDocumentSchemaTypes,
  singletonDocumentTypes,
} from "../schemas";

import { startCase } from "lodash";
import pluralize from "pluralize";
import { BookIcon } from "@sanity/icons";
import { docs } from "./documentation/docs";
import { DocumentationPane } from "./documentation/DocumentationPane";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Content Editor Guides")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Content Editor Guides")
            .items(
              docs.map((doc) =>
                S.listItem()
                  .title(doc.title)
                  .icon(BookIcon)
                  .child(
                    S.component(DocumentationPane)
                      .title(doc.title)
                      .options({ documentId: doc.id }),
                  ),
              ),
            ),
        ),
      S.divider().title("Settings"),
      ...singletonDocumentTypes.map((t) =>
        S.listItem()
          .title(startCase(t.title ?? t.name))
          .id(`${t.name}-singleton`)
          .icon(t.icon)
          .child(
            S.document().schemaType(t.name).documentId(`${t.name}-singleton`),
          ),
      ),
      S.divider().title("Internet Resources"),
      ...internetResourceDocumentSchemaTypes.map((t) =>
        S.documentTypeListItem(t.name).title(
          startCase(pluralize(t.title ?? t.name)),
        ),
      ),
      S.divider().title("Resource Classification"),
      ...classificationDocumentTypes.map((t) =>
        S.documentTypeListItem(t.name).title(
          startCase(pluralize(t.title ?? t.name)),
        ),
      ),
      S.divider().title("Page-building Documents"),
      ...documentTypes.map((t) =>
        S.documentTypeListItem(t.name).title(
          startCase(pluralize(t.title ?? t.name)),
        ),
      ),
    ]);

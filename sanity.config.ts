import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { ConvertAction } from "./actions";
import { INTERNET_RESOURCE_TYPES } from "./constants";
import { InternetResourceType } from "./types";
import { startCase } from "lodash";
import pluralize from "pluralize";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

const singletonTypes = new Set(["organization"]);

const nonSingletonTypes = schemaTypes
  .map((x) => x.name)
  .filter((y) => !singletonTypes.has(y));

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",
  projectId: "vg3sb730",
  // @ts-ignore
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Organization")
              .id("organization")
              .child(
                S.document()
                  .schemaType("organization")
                  .documentId("organization")
              ),

            ...nonSingletonTypes.map((ns) =>
              S.documentTypeListItem(ns).title(startCase(pluralize(ns)))
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (prev, context) => {
      const nonSingletonActions = singletonTypes.has(context.schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev;

      return INTERNET_RESOURCE_TYPES.includes(
        context.schemaType as InternetResourceType
      )
        ? [...nonSingletonActions, ConvertAction]
        : nonSingletonActions;
    },
  },
});

import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { dashboardTool } from "@sanity/dashboard";

import { documentListWidget } from "sanity-plugin-dashboard-widget-document-list";

import { structure } from "./structure";
import {
  internetResourceDocumentTypes,
  schemaTypes,
  singletonDocumentTypes,
} from "./schemas";
import { ConvertAction, setReadyForReviewOnPublishAction } from "./actions";

const SINGLETON_TYPES: Set<string> = new Set([
  ...singletonDocumentTypes.map((t) => t.name),
]);

const INTERNET_RESOURCE_TYPES: Set<string> = new Set([
  ...internetResourceDocumentTypes.map((t) => t.name),
]);

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    deskTool({
      structure,
    }),
    dashboardTool({
      widgets: [
        documentListWidget({
          apiVersion: process.env.SANITY_STUDIO_API_VERSION,
          title: "Documents Awaiting Review",
          query: "*[readyForReview == true]",
          layout: {
            width: "small",
          },
        }),
      ],
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const nonSingletonTemplates = templates.filter(
        ({ schemaType }) => !SINGLETON_TYPES.has(schemaType)
      );

      return [...nonSingletonTemplates];
    },
  },
  document: {
    actions: (prev, context) => {
      const nonSingletonActions = SINGLETON_TYPES.has(context.schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev;

      return INTERNET_RESOURCE_TYPES.has(context.schemaType)
        ? [
            ...nonSingletonActions.map((a) =>
              a.action === "publish"
                ? setReadyForReviewOnPublishAction(a, context)
                : a
            ),
            ConvertAction,
          ]
        : nonSingletonActions;
    },
  },
});

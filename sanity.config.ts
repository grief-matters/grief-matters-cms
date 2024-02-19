import { DocumentActionComponent, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
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

const singletonTypes: Set<string> = new Set([
  ...singletonDocumentTypes.map((t) => t.name),
]);

const internetResourceTypes: Set<string> = new Set([
  ...internetResourceDocumentTypes.map((t) => t.name),
]);

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool({
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
        ({ schemaType }) => !singletonTypes.has(schemaType)
      );

      return [...nonSingletonTemplates];
    },
  },
  document: {
    actions: (prev, context) => {
      const nonSingletonActions = singletonTypes.has(context.schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev;

      return internetResourceTypes.has(context.schemaType)
        ? ([
            ...nonSingletonActions.map((a) =>
              a.action === "publish"
                ? setReadyForReviewOnPublishAction(a, context)
                : a
            ),
            ConvertAction,
          ] as DocumentActionComponent[])
        : nonSingletonActions;
    },
  },
});

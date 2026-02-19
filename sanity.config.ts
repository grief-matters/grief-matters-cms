import { type DocumentActionComponent, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { dashboardTool } from "@sanity/dashboard";

import websiteManagementTool from "./tools/website-tools/plugin";

import { structure } from "./structure";
import {
  internetResourceDocumentTypes,
  schemaTypes,
  singletonDocumentTypes,
} from "./schemas";
import { ConvertAction } from "./actions";
import { resourceTypeOverviewWidget } from "./dashboard-widgets/resource-type-overview/plugin";
import { categoryTreeWidget } from "./dashboard-widgets/category-tree/plugin";

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
        resourceTypeOverviewWidget({
          layout: { width: "medium", height: "medium" },
        }),
        categoryTreeWidget({
          layout: { width: "medium", height: "medium" },
        }),
      ],
    }),
    visionTool(),
    websiteManagementTool(),
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
        ? ([...nonSingletonActions, ConvertAction] as DocumentActionComponent[])
        : nonSingletonActions;
    },
  },
});

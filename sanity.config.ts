import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import {
  internetResourceDocumentTypes,
  schemaTypes,
  singletonDocumentTypes,
} from "./schemas";
import { ConvertAction } from "./actions";
import { structure } from "./structure";

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
  projectId: "vg3sb730",
  // @ts-ignore
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const nonSingletonTemplates = templates.filter(
        ({ schemaType }) => !SINGLETON_TYPES.has(schemaType)
      );

      // const categoryChildTemplate = {
      //   id: "category-child",
      //   title: "Category: Child",
      //   schemaType: "category",
      //   parameters: [{ name: `parentId`, title: `Parent ID`, type: `string` }],
      //   // This value will be passed-in from desk structure
      //   value: ({ parentId }: { parentId: string }) => ({
      //     parent: { _type: "reference", _ref: parentId },
      //   }),
      // };

      return [...nonSingletonTemplates];
    },
  },
  document: {
    actions: (prev, context) => {
      const nonSingletonActions = SINGLETON_TYPES.has(context.schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev;

      return INTERNET_RESOURCE_TYPES.has(context.schemaType)
        ? [...nonSingletonActions, ConvertAction]
        : nonSingletonActions;
    },
  },
});

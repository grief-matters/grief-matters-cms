import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { ConvertAction } from "./actions";
import { INTERNET_RESOURCE_TYPES } from "./constants";
import { InternetResourceType } from "./types";

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",
  projectId: "vg3sb730",
  // @ts-ignore
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      return INTERNET_RESOURCE_TYPES.includes(
        context.schemaType as InternetResourceType
      )
        ? [...prev, ConvertAction]
        : prev;
    },
  },
});

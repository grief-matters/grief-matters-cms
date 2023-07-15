import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { HelloWorldAction } from "./actions";

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",
  projectId: "vg3sb730",
  // @ts-ignore
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [deskTool(), visionTool()],
  document: {
    actions: [HelloWorldAction],
  },
  schema: {
    types: schemaTypes,
  },
});

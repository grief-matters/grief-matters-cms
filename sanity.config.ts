import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { HelloWorldAction } from "./actions";

export default defineConfig({
  name: "default",
  title: "grief-matters-cms",

  projectId: "vg3sb730",
  dataset: "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: [HelloWorldAction],
  },
});

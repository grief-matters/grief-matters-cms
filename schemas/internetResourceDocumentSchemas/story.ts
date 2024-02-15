import { defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { accessibleImageField } from "../fields";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  isUrlRequired: true,
});

const storySchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
  fields: [...base.fields, accessibleImageField],
});

export default storySchema;

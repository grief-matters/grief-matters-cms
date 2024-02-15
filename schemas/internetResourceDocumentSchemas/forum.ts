import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { broadFocusToggleField } from "../fields";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "forum",
  title: "Forum",
  icon: UsersIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title'
const forumSchema = defineType({
  ...base,
  fields: [...base.fields, broadFocusToggleField],
  preview: reviewableDocumentPreviewConfig,
});

export default forumSchema;

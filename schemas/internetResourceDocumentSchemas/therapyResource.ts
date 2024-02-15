import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { hasSpanishVersionField } from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "therapyResource",
  title: "Therapy Resource",
  icon: UsersIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title' field
const therapyResourceSchema = defineType({
  ...base,
  fields: [...base.fields, hasSpanishVersionField],
  preview: reviewableDocumentPreviewConfig,
});

export default therapyResourceSchema;

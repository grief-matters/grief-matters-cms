import { defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "blog",
  title: "Blog",
  icon: DocumentsIcon,
  isUrlRequired: true,
});

const blogSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default blogSchema;

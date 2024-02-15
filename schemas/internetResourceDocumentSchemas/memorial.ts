import { DocumentIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "memorial",
  title: "Memorial",
  icon: DocumentIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title'
const memorialSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default memorialSchema;

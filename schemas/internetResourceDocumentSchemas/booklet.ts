import { BookIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "booklet",
  title: "Booklet",
  icon: BookIcon,
  isUrlRequired: true,
});

const bookletSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default bookletSchema;

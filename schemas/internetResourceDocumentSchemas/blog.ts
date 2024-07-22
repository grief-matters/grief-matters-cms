import { defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "blog",
  title: "Blog",
  icon: DocumentsIcon,
  isUrlRequired: true,
});

const blogSchema = defineType({
  ...base,
});

export default blogSchema;

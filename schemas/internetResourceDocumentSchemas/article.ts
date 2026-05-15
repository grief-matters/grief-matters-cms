import { defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import hasSpanishVersionField from "../fields/hasSpanishVersionField";

const base = createBaseInternetResourceSchema({
  name: "article",
  title: "Article",
  icon: DocumentIcon,
  isUrlRequired: true,
});

const articleSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    hasSpanishVersionField,
    // Future enhancement
    // defineField({
    //   title: "Parent Blog",
    //   name: "parentBlog",
    //   type: "reference",
    //   to: [{ type: "blog" }],
    // }),
  ],
});

export default articleSchema;

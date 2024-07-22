import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "book",
  title: "Book",
  icon: BookIcon,
  isUrlRequired: true,
});

const bookSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({
      title: "Author",
      name: "author",
      type: "string",
    }),
    defineField({
      title: "ISBN",
      name: "isbn",
      type: "string",
      validation: (rule) =>
        rule.min(10).max(13).error("An ISBN is 10 or 13 digits long"),
    }),
  ],
});

export default bookSchema;

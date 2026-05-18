import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";

const base = createBaseInternetResourceSchema({
  name: "blog",
  title: "Blog",
  icon: DocumentsIcon,
  isUrlRequired: true,
});

const blogSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
  ],
});

export default blogSchema;

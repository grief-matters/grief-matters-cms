import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";
import hasSpanishVersionField from "../fields/hasSpanishVersionField";

const base = createBaseInternetResourceSchema({
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  isUrlRequired: true,
});

const storySchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
    hasSpanishVersionField,
  ],
});

export default storySchema;

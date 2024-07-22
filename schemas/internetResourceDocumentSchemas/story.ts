import { defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { accessibleImageField } from "../fields";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  isUrlRequired: true,
});

const storySchema = defineType({
  ...base,

  fields: [...base.fields, accessibleImageField],
});

export default storySchema;

import { defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import { hasSpanishVersionField } from "../fields";

const base = createBaseInternetResourceSchema({
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  isUrlRequired: true,
});

const storySchema = defineType({
  ...base,

  fields: [...base.fields, hasSpanishVersionField],
});

export default storySchema;

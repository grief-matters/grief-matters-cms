import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";

const base = createBaseInternetResourceSchema({
  name: "course",
  title: "Course",
  icon: PresentationIcon,
  isUrlRequired: true,
});

const courseSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
  ],
});

export default courseSchema;

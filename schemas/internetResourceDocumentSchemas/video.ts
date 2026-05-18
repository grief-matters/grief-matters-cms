import { DocumentVideoIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";

const base = createBaseInternetResourceSchema({
  name: "video",
  title: "Video",
  icon: DocumentVideoIcon,
  isUrlRequired: true,
});

const videoSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
  ],
});

export default videoSchema;

import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";

const base = createBaseInternetResourceSchema({
  name: "webinar",
  title: "Webinar",
  icon: PresentationIcon,
  isUrlRequired: true,
});

const webinarSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
  ],
});

export default webinarSchema;

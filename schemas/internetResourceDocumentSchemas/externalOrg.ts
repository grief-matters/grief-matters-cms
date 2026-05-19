import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "externalOrg",
  title: "External Org",
  icon: EarthGlobeIcon,
  includeSource: false,
});

const externalOrgSchema = defineType({
  ...base,

  fields: [
    defineField({
      title: "Logo",
      name: "logo",
      type: "image",
    }),
    ...base.fields,
  ],
});

export default externalOrgSchema;

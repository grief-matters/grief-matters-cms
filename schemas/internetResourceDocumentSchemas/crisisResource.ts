import { defineArrayMember, defineField, defineType } from "sanity";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "crisisResource",
  title: "Crisis Resource",
  includeAudienceRole: false,
  isUrlRequired: false,
});

export default defineType({
  ...base,
  fields: [
    ...base.fields,
    defineField({
      type: "array",
      name: "contactMethods",
      title: "Contact Methods",
      of: [
        defineArrayMember({
          type: "contactMethod",
        }),
      ],
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "image",
    }),
  ],
});

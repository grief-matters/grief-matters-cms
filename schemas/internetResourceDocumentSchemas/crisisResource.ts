import { defineArrayMember, defineField, defineType } from "sanity";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "crisisResource",
  title: "Crisis Resource",
  includeAudienceRole: false,
  includeRichTextDescription: true,
  isUrlRequired: false,
});

export default defineType({
  ...base,
  fields: [
    ...base.fields,
    defineField({
      deprecated: { reason: "moved to source" },
      type: "reference",
      name: "website",
      title: "Website",
      description: "The source website for the crisis resource (if we have it)",
      to: [{ type: "website" }],
    }),
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

import { defineArrayMember, defineField, defineType } from "sanity";

import {
  categoriesField,
  populationsField,
  portableTextDescriptionField,
  urlField,
} from "../fields";

export default defineType({
  type: "document",
  name: "crisisResource",
  title: "Crisis Resource",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      description:
        "The name of the crisis resource (this might be different from the website name)",
    }),
    portableTextDescriptionField,
    urlField,
    defineField({
      type: "reference",
      name: "website",
      title: "Website",
      description: "The source website for the crisis resource (if we have it)",
      to: [{ type: "website" }],
    }),
    { ...categoriesField, validation: undefined },
    populationsField,
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
      type: "array",
      name: "languages",
      title: "Available Languages",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: ["English", "Spanish"],
      },
    }),
  ],
});

import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export default defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      title: "Name",
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Logos",
      name: "logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              title: "Logo variant",
              name: "variant",
              type: "string",
            }),
            defineField({
              title: "Logo",
              name: "logo",
              type: "logo",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Mission Statement",
      name: "mission",
      type: "array",
      description: "Organization mission statement",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Slogan",
      name: "slogan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Core Values",
      name: "coreValues",
      type: "array",
      of: [defineArrayMember({ type: "coreValue" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Small Print",
      description:
        "All the text that usually appears in the footer including legal information, disclaimers etc.",
      name: "smallPrint",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});

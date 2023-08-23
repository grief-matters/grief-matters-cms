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
    }),
    defineField({
      title: "Mission Statement",
      name: "mission",
      type: "text",
    }),
    defineField({
      title: "Slogan",
      name: "slogan",
      type: "string",
    }),
    defineField({
      title: "Core Values",
      name: "coreValues",
      type: "array",
      of: [defineArrayMember({ type: "coreValue" })],
    }),
    defineField({
      title: "Our Story",
      name: "ourStory",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
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
    }),
    defineField({
      title: "Team",
      name: "team",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
    }),
    defineField({
      title: "Acknowledgements",
      name: "acknowledgements",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
    }),
  ],
});

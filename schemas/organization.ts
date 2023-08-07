import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "organization",
  type: "document",
  title: "Organization",
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
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "coreValue" }] }),
      ],
    }),
    defineField({
      title: "Legal",
      name: "legal",
      type: "text",
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

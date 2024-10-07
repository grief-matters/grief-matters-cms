import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "coreContentGroups",
  title: "Core Content Groups",
  description: "Does this show",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Core Content Groups",
      // readOnly: true,
      // hidden: true,
    }),
    defineField({
      name: "groups",
      title: "Core Content Groups",
      description:
        "The Core Content Groups map out the major pathways through Grief Matters content. As an example; they are presently used for our top-level site navigation.",
      type: "array",
      of: [defineArrayMember({ type: "coreContentGroup" })],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

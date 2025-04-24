import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "smartCollectionLink",
  title: "Smart Collection Link",
  description: "A link to an existing Smart Resource Collection",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "The text that a user will see",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "smartCollection",
      type: "reference",
      to: { type: "smartResourceCollection" },
    }),
  ],
  preview: {
    select: {
      label: "label",
      collection: "smartCollection.title",
    },
    prepare: ({ label, collection }) => ({
      title: label,
      subtitle: `Link to collection '${collection}'`,
    }),
  },
});

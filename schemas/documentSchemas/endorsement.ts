import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "endorsement",
  title: "Endorsement",
  icon: CommentIcon,
  type: "document",
  fields: [
    defineField({
      name: "endorsement",
      title: "Endorsement",
      type: "text",
      description:
        "The full endorsement text. This is the complete statement from the endorser.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description:
        "A shorter excerpt from the endorsement, suitable for previews and summary displays.",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endorser",
      title: "Endorser",
      type: "reference",
      to: [{ type: "person" }],
      description:
        "The person who gave this endorsement. Select an existing person or create a new one.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      endorserName: "endorser.fullName",
      excerpt: "excerpt",
    },
    prepare: ({ endorserName, excerpt }) => ({
      title: endorserName ?? "Unknown endorser",
      subtitle: excerpt,
    }),
  },
});

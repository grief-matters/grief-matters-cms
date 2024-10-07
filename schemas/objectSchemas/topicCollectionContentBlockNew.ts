import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "topicCollectionContentBlockNew",
  preview: {
    select: {
      blocks: "topicContentBlocks",
    },
    prepare: ({ blocks }) => ({
      title: "Topic Collection Content Block",
      subtitle: `Contains ${blocks?.length ?? "0"} topic`,
    }),
  },
  fields: [
    defineField({
      name: "topicContentBlocks",
      type: "array",
      of: [{ type: "topicContentBlock" }],
    }),
  ],
});

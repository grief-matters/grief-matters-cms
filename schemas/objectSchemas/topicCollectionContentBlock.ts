import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "topicCollectionContentBlock",
  fields: [
    defineField({
      name: "topicCollection",
      title: "Topic Collection",
      description: "Select an existing topic collection",
      type: "reference",
      to: [{ type: "topicCollection" }],
    }),
    defineField({
      name: "showDescription",
      title: "Show Topic Collection Description",
      description:
        "Show the Topic Collection description as part of the content block",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showImages",
      title: "Show Images",
      description: "Whether or not to display each topic's cover image",
      type: "string",
      initialValue: "none",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Top 3", value: "topThree" },
          { title: "All", value: "all" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "showDescriptions",
      title: "Show Individual Topic Descriptions",
      description: "Whether or not to display each topic's description",
      type: "string",
      initialValue: "none",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Top 3", value: "topThree" },
          { title: "All", value: "all" },
        ],
        layout: "radio",
      },
    }),
  ],
});

import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "topicContentBlock",
  preview: {
    select: {
      topic: "topic.title",
      showImage: "showImage",
      showDescription: "showDescription",
      showSubtopics: "showSubtopics",
    },
    prepare: ({ topic, showImage, showDescription, showSubtopics }) => {
      const visibleElements = [
        showImage && "Image",
        showDescription && "Description",
        showSubtopics && "Subtopics",
      ].filter(Boolean);

      const subtitle =
        visibleElements.length > 0
          ? `Showing ${visibleElements.join(", ")}`
          : "Showing topic name only";
      return {
        title: `Topic Content Block: ${topic}`,
        subtitle,
      };
    },
  },
  fields: [
    defineField({
      type: "reference",
      name: "topic",
      to: [{ type: "category" }, { type: "smartCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "string",
      name: "titleOverride",
      title: "Title to Use",
      description:
        "An optional label to use in place of the usual topic title. Leave blank to display the usual title",
    }),
    defineField({
      type: "boolean",
      name: "showImage",
      title: "Show Topic Cover Image",
      description: "Whether or not to show the cover image for the topic",
      initialValue: false,
    }),
    defineField({
      type: "boolean",
      name: "showDescription",
      title: "Show Topic Description",
      description: "Whether or not to show the description for the topic",
      initialValue: false,
    }),
    defineField({
      type: "boolean",
      name: "showSubtopics",
      title: "Show All Subtopics",
      description:
        "Recursively expand to show subtopics (if the topic has them)",
      initialValue: false,
    }),
  ],
});

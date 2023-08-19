import { defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  type: "object",
  name: "accessibleImage",
  icon: ImageIcon,
  fields: [
    {
      title: "Image",
      name: "image",
      type: "image",
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      description: "Alternative text is required.",
      hidden: ({ parent }) => !parent?.image,
      validation: (Rule) => [Rule.required()],
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
      hidden: ({ parent }) => !parent?.image,
      options: {
        isHighlighted: true,
      },
    },
  ],
});

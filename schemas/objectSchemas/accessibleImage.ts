import { defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  type: "object",
  name: "accessibleImage",
  title: "Image",
  icon: ImageIcon,
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      title: "Image",
      name: "image",
      type: "image",
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      description:
        "This is for accessibility (for example, a screen reader may read this description aloud to a sight-impaired user).",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((altText: string) => {
          if (typeof altText === "undefined") {
            return true; // Allow undefined values
          }

          const patterns = ["image", "photo", "photograph"];

          const containsPattern = patterns.some((p) => altText?.includes(p));

          return containsPattern
            ? `There is no need to use terms like 'image of' or 'photo of'`
            : true;
        }).warning(),
      ],
    },
    {
      type: "reference",
      name: "imageSource",
      title: "Image Source",
      description:
        "The source of the image. If you do not see the correct source listed please create one. This enables us to track our licensing compliance",
      to: [{ type: "imageSource" }],
      validation: (Rule) => Rule.required().warning(),
    },
  ],
});

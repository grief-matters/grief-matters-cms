import { defineField, defineType } from "sanity";
import { titleField } from "../fields";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  type: "document",
  name: "imageCollection",
  title: "Image Collection",
  icon: ImageIcon,
  description: "A collection of images, presently only used for fall-backs",
  fields: [
    titleField,
    defineField({
      name: "images",
      title: "Images",
      description: "The images assigned to this collection.",
      type: "array",
      of: [
        {
          type: "accessibleImage",
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});

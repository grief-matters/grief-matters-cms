import { defineArrayMember, defineField, defineType } from "sanity";
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
      deprecated: {
        reason:
          "Replaced by imagesRef (array of references to imageAsset documents). Old data has been migrated; this field will be removed in a future release.",
      },
    }),
    defineField({
      name: "imagesRef",
      title: "Images",
      description: "The images assigned to this collection.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "imageAsset" }],
        }),
      ],
    }),
  ],
});

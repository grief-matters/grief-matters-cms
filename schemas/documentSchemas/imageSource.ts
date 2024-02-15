import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { requiredUrlField } from "../fields";

const licenseTypes = [
  {
    value: "cc-by",
    title: "CC BY",
  },
  {
    value: "cc-by-sa",
    title: "CC BY-SA",
  },
  {
    value: "cc-by-nc",
    title: "CC BY-NC",
  },
  {
    value: "cc-by-nc-sa",
    title: "CC BY-NC-SA",
  },
  {
    value: "cc-by-nd",
    title: "CC BY-ND",
  },
  {
    value: "cc-by-nc-nd",
    title: "CC BY-NC-ND",
  },
  {
    value: "cc-zero",
    title: "CC 0",
  },
  {
    value: "custom",
    title: "Custom License",
  },
];

export default defineType({
  type: "document",
  name: "imageSource",
  title: "Image Source",
  description: "A source for images to assist with licensing ",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The name of the Image Source",
      validation: (rule) => rule.required(),
    }),
    defineField({
      ...requiredUrlField,
      name: "sourceUrl",
    }),
    defineField({
      name: "license",
      title: "Image License",
      type: "string",
      options: {
        list: licenseTypes,
      },
    }),
    defineField({
      hidden: ({ document }) => document?.license !== "custom",
      name: "customLicense",
      title: "Custom License",
      description:
        "Please read the license terms of the Image Source carefully to ensure that images can be used without permission or attribution. Or if permission is required, that it has been sought.",
      type: "object",
      fields: [
        {
          ...requiredUrlField,
          name: "licenseUrl",
          description: `Please provide a link to the Image Source's custom license`,
        },
      ],
    }),
  ],
});

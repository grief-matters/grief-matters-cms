import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  description: "This content type defines the content for the home page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Home Page",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      description:
        "The selected image will appear at the top of the home as the background for the introductory content.",
      type: "accessibleImage",
      options: {
        collapsed: false,
      },
    }),
    defineField({
      name: "featurePanels",
      title: "Feature Panels",
      description: "References to instances of the Featured Content type",
      type: "array",
      of: [{ type: "reference", to: [{ type: "featuredContent" }] }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Small Print",
      name: "smallPrint",
      type: "array",
      description:
        "The small print to appear in the footer (e.g. any legal or disclaimer text)",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
  ],
});

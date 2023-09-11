import { defineType } from "sanity";

export default defineType({
  name: "logo",
  type: "object",
  title: "Logo Image",
  fields: [
    {
      title: "Logo image",
      name: "image",
      type: "image",
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      description:
        "Alternative text is required - it is used for accessibility.",
      hidden: ({ parent }) => !parent?.image,
      validation: (Rule) => [Rule.required()],
    },
  ],
});

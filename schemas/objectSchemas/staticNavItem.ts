import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "staticNavItem",
  title: "Static Nav Item",
  description: `A static nav item can be used to navigate to a specific page on the website e.g '/my/custom-page'. You should be certain that the page you are routing to exists. For pages of resources, use Nav Item instead`,
  preview: {
    select: {
      label: "label",
      url: "url",
    },
    prepare: ({ label, url }) => ({
      title: label,
      subtitle: `Goes to: ${url}`,
    }),
  },
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "The text that a user will see",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Relative Path",
      description: "A relative path for the desired page",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ allowRelative: true, relativeOnly: true })
          .custom((relativeUrl) => {
            if (typeof relativeUrl !== "string") {
              return true;
            }

            if (!relativeUrl.startsWith("/")) {
              return "Internal Page Links must start with a '/' character";
            }

            return (
              !/\s/.test(relativeUrl) ||
              "Do not use spaces in URLs, use '-' instead"
            );
          }),
    }),
  ],
});

import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "wdynrnEntry",
  title: "What Do You Need Right Now Entry",
  icon: HelpCircleIcon,
  description:
    "An entry to appear as part of the 'What Do You Need Right Now?' feature",
  validation: (rule) =>
    rule.custom((doc) => {
      if (!doc) return true;
      const hasCategory = !!(doc as Record<string, unknown>).category;
      const hasUrl = !!(doc as Record<string, unknown>).url;
      if (!hasCategory && !hasUrl) {
        return "Either a category or a page URL must be set";
      }
      return true;
    }),
  fieldsets: [
    {
      name: "destination",
      title: "Destination",
      description:
        "Choose where this entry takes the user. Set either a category or a page URL — not both. To switch, clear the current value first.",
    },
  ],
  fields: [
    defineField({
      name: "entryText",
      description: "The text that the user will see in the list",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "The category page to take the user to",
      type: "reference",
      to: [{ type: "category" }],
      fieldset: "destination",
      options: {
        disableNew: true,
      },
      hidden: ({ document }) => !!document?.url,
    }),
    defineField({
      name: "url",
      title: "Page Url",
      description: "A relative path for the desired page",
      type: "url",
      fieldset: "destination",
      hidden: ({ document }) => !!document?.category,
      validation: (rule) =>
        rule
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

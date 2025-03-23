import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "personGroupBlock",
  icon: UsersIcon,
  preview: {
    select: {
      name: "group.name",
    },
    prepare: ({ name }) => ({
      title: name,
      subtitle: "Person Group Block",
    }),
  },
  fieldsets: [
    {
      name: "config",
      title: "Content Configuration",
      description:
        "Configure these options to control how your content will be displayed",
    },
  ],
  fields: [
    defineField({
      name: "group",
      title: "Person Group",
      description: "The Person Group to use in this content block",
      type: "reference",
      to: [{ type: "personGroup" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description:
        "This group should be featured as a prominent piece of content",
      type: "boolean",
      initialValue: false,
      fieldset: "config",
    }),
    defineField({
      name: "showName",
      title: "Show Group Name",
      description:
        "The group's name should be shown as part of this piece of content",
      type: "boolean",
      initialValue: true,
      fieldset: "config",
    }),
    defineField({
      name: "showDescription",
      title: "Show Group Description",
      description:
        "The group's description should be shown as part of this piece of content",
      type: "boolean",
      initialValue: true,
      fieldset: "config",
    }),
  ],
});

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "navItemGroup",
  type: "object",
  title: "Navigation Item Group",
  description: "Test",
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Nav Item Group",
    }),
  },
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "A label for this group of navigation items",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      description: "The navigation items to include in this group",
      type: "array",
      of: [
        defineArrayMember({
          type: "navItem",
        }),
        defineArrayMember({
          type: "staticNavItem",
        }),
        defineArrayMember({
          type: "navItemGroup",
        }),
      ],
    }),
  ],
});

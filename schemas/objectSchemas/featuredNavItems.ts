import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "featuredNavItems",
  title: "Featured Navigation Items",
  description:
    "Featured navigation items will be shown with the image of their entry point, or a fallback in the case of static navigation items",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "navItem",
        }),
        defineArrayMember({
          type: "staticNavItem",
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

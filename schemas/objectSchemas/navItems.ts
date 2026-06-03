import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "navItems",
  type: "object",
  title: "Navigation Items",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "navItem",
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

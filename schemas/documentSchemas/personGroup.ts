import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export default defineType({
  name: "personGroup",
  title: "Person Group",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name of Group",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "An optional description for the group",
      type: "text",
    }),
    defineField({
      name: "members",
      title: "Members",
      description: "The members of the group",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
        }),
      ],
      validation: (rule) => rule.unique().min(1),
    }),
  ],
});

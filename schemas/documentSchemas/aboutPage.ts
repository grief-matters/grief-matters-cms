import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fieldsets: [{ name: "team", title: "Meet the Team" }],
  fields: [
    defineField({
      name: "ourStory",
      title: "Our Story",
      description: `This will appear under "Our Story" on the "About Us" page`,
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "creators",
      title: "Co-Creators",
      description: "The co-creators of the Why Grief Matters website",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
        }),
      ],
    }),
    defineField({
      name: "teamIntro",
      description: "A short introduction to the team as a whole",
      title: "Introduction",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
      fieldset: "team",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      description: "The Why Grief Matters team",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
        }),
      ],
      fieldset: "team",
    }),
  ],
});

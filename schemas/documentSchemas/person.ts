import { defineArrayMember, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      description:
        "A short bio about the person, should be written in third-person",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
    defineField({
      name: "personalStory",
      title: "Personal Story",
      description:
        "An optional extended bio, written from a personal (first person) perspective",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social Media and Contact",
      description: "Optional social media and contact details",
      type: "socials",
    }),
  ],
});

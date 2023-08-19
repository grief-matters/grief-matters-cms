import { defineField, defineType } from "sanity";

const types = [
  { title: "Telephone", value: "tel" },
  { title: "Text (SMS)", value: "sms" },
  { title: "TTY (teletypewriter)", value: "tty" },
  { title: "Other", value: "other" },
];

export default defineType({
  type: "object",
  name: "telephoneNumber",
  fields: [
    defineField({
      type: "string",
      name: "type",
      options: {
        list: types,
      },
    }),
    defineField({
      type: "string",
      name: "description",
      description: "The special purpose of this number",
      hidden: ({ parent }) => parent?.type !== "other",
    }),
    defineField({
      type: "string",
      name: "label",
      title: "Tel (display name)",
      description: "This is what the user will see on screen",
    }),
    defineField({
      type: "string",
      name: "number",
      title: "Tel (number)",
      description:
        "This is the number that will be dialled when the user clicks",
    }),
  ],
});

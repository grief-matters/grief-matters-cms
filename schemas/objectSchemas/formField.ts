import startCase from "lodash/startCase";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "formField",
  type: "object",
  title: "Form Field",
  preview: {
    select: {
      label: "label",
      name: "name",
      type: "type",
      required: "required",
    },
    prepare: ({ label, name, type, required }) => ({
      title: startCase(`${required ? "Required" : "Optional"} ${type} Field`),
      subtitle: `Label: "${label}", ID: "${name}"`,
    }),
  },
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "The label that will be used on the form field",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      description:
        "An optional description if a user may need assistance completing the field",
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Field ID",
      description:
        "This will be used to track the field. It should be machine readable and unique within the form",
      validation: (Rule) =>
        Rule.regex(/[\s]+/, { invert: true })
          .lowercase()
          .required()
          .error("Must be lowercase and contain no whitespace"),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: [
          "text",
          "email",
          "number",
          "textarea",
          "select",
          "checkbox",
          "radio",
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "text",
    }),
    defineField({
      name: "inputOptions",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => [
        rule.unique(),
        rule.custom((options, context) => {
          if (!Array.isArray(options)) {
            return true;
          }

          if (options.some((o: any) => (o ?? "").length === 0)) {
            return "You cannot have an empty option";
          }

          const parent = context.parent as { type?: string } | undefined;
          if (
            ["select", "radio"].includes(parent?.type ?? "") &&
            options.length < 2
          ) {
            return "Select and radio fields require at least 2 options";
          }

          return true;
        }),
      ],
      hidden: ({ parent }) =>
        !["select", "radio", "checkbox"].includes(parent?.type),
    }),
    defineField({
      name: "placeholder",
      type: "string",
      title: "Placeholder",
      description: "Placeholder text shown inside the input before the user types",
      hidden: ({ parent }) =>
        ["checkbox", "radio", "select"].includes(parent?.type),
    }),
    defineField({
      name: "required",
      type: "boolean",
      title: "Required",
      initialValue: true,
    }),
  ],
});

import { defineField, defineType } from "sanity";
import { simpleDescriptionField, titleField } from "../fields";

export default defineType({
  name: "form",
  type: "document",
  title: "Form",
  fields: [
    titleField,
    defineField({
      name: "formId",
      type: "slug",
      title: "Form ID",
      description:
        "A friendly identifier used by the front-end to look up this form (e.g. 'contact-us', 'volunteer-signup')",
      options: {
        source: "title",
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      validation: (Rule) => Rule.required(),
    }),
    simpleDescriptionField,
    defineField({
      name: "fields",
      description: "The fields that make up the form",
      type: "array",
      title: "Fields",
      of: [{ type: "formField" }],
      validation: (Rule) =>
        Rule.custom((fields) => {
          if (typeof fields === "undefined") {
            return true;
          }

          if (fields.length === 0) {
            return "At least one field is required";
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fieldNames = fields.map((field: any) => field.name);
          const duplicates = fieldNames.filter(
            (name, index) => fieldNames.indexOf(name) !== index
          );

          return duplicates.length > 0
            ? `Duplicate field names found: ${[...new Set(duplicates)].join(
                ", "
              )}`
            : true;
        }),
    }),
    defineField({
      name: "submitButtonText",
      type: "string",
      title: "Submit Button Text",
      description: "The text displayed on the form's submit button",
      initialValue: "Submit",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      type: "text",
      title: "Success Message",
      description:
        "The confirmation message shown to the user after successful submission",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

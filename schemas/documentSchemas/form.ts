import { defineField, defineType } from "sanity";
import { simpleDescriptionField, titleField } from "../fields";

export default defineType({
  name: "form",
  type: "document",
  title: "Form",
  fields: [
    titleField,
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
    {
      name: "submitAction",
      type: "string",
      title: "Submit Action",
      description:
        "Where the form submits data (e.g., API endpoint, email handler, etc.)",
    },
  ],
});

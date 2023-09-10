import { defineArrayMember, defineField, defineType } from "sanity";

import { readyForReviewField, urlField } from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "crisisResource",
  title: "Crisis Resource",
  preview: reviewableDocumentPreviewConfig,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
    urlField,
    defineField({
      type: "reference",
      name: "website",
      title: "Website",
      to: [{ type: "website" }],
    }),
    defineField({
      type: "array",
      name: "populations",
      title: "Populations",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "population" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "availabilities",
      title: "Availability",
      of: [
        defineArrayMember({
          type: "availability",
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "contactNumbers",
      title: "Contact Numbers",
      of: [
        defineArrayMember({
          type: "telephoneNumber",
        }),
      ],
    }),
    defineField({
      type: "email",
      name: "email",
      title: "Email",
    }),
    defineField({
      type: "array",
      name: "languages",
      title: "Available Languages",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: ["English", "Spanish"],
      },
    }),
    readyForReviewField,
  ],
});

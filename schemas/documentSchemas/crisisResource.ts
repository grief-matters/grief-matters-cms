import { defineArrayMember, defineField, defineType } from "sanity";

import {
  categoriesField,
  populationsField,
  portableTextDescriptionField,
  readyForReviewField,
  urlField,
} from "../fields";
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
      description:
        "The name of the crisis resource (this might be different from the website name)",
    }),
    portableTextDescriptionField,
    urlField,
    defineField({
      type: "reference",
      name: "website",
      title: "Website",
      description: "The source website for the crisis resource (if we have it)",
      to: [{ type: "website" }],
    }),
    { ...categoriesField, validation: undefined },
    populationsField,
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
      description: "An email address to get crisis support (if available)",
      title: "Email",
    }),
    defineField({
      name: "liveChatUrl",
      title: "Live Chat",
      description: "The URL at which live chat help can be found",
      type: "url",
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

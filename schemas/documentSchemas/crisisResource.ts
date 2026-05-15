import { defineArrayMember, defineField, defineType } from "sanity";
import audiencesField from "../fields/audiencesField";
import portableTextDescriptionField from "../fields/portableTextDescriptionField";
import titleField from "../fields/titleField";
import urlField from "../fields/urlField";

export default defineType({
  type: "document",
  name: "crisisResource",
  title: "Crisis Resource",
  fields: [
    titleField,
    portableTextDescriptionField,
    urlField,
    defineField({
      type: "reference",
      name: "website",
      title: "Website",
      description: "The source website for the crisis resource (if we have it)",
      to: [{ type: "website" }],
    }),
    audiencesField,
    defineField({
      type: "array",
      name: "contactMethods",
      title: "Contact Methods",
      of: [
        defineArrayMember({
          type: "contactMethod",
        }),
      ],
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "image",
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
  ],
});

import { defineField } from "sanity";
import ResourceUrlInput from "../../components/ResourceUrlInput";

const urlField = defineField({
  title: "URL",
  description:
    "This should be a valid web address, usually starting with 'https://'. Paths may be used but be aware this likely points to a specific resource, rather than a website overall.",
  name: "resourceUrl",
  type: "url",
  validation: (Rule) =>
    Rule.custom((resourceUrl) => {
      const pattern = new RegExp("http[s]*://[^/]+(/.+)");
      if (pattern.test(resourceUrl)) {
        return "Warning: URL Contains A Path. Consider that this may point to a resource rather than a website.";
      } else {
        return true;
      }
    }).warning(),
  components: {
    input: ResourceUrlInput,
  },
});

export const requiredUrlField = defineField({
  ...urlField,
  validation: (Rule) => Rule.required(),
});

export default urlField;

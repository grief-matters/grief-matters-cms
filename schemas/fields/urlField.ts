import { defineField } from "sanity";
import ResourceUrlInput from "../../components/ResourceUrlInput";

const urlField = defineField({
  title: "URL",
  description:
    "This should be a valid web address, usually starting with 'https://'",
  name: "resourceUrl",
  type: "url",
  components: {
    input: ResourceUrlInput,
  },
});

export const requiredUrlField = defineField({
  ...urlField,
  validation: (Rule) => Rule.required(),
});

export default urlField;

import { defineField } from "sanity";
import ResourceUrlInput from "../../components/ResourceUrlInput";

export default defineField({
  title: "URL",
  description:
    "This should be a valid web address, usually starting with 'https://'",
  name: "resourceUrl",
  type: "url",
  components: {
    input: ResourceUrlInput,
  },
});

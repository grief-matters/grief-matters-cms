import { defineType } from "sanity";

export default defineType({
  name: "logo",
  type: "object",
  title: "Logo Image",
  fields: [
    {
      title: "Logo image",
      name: "image",
      type: "image",
    },
  ],
});

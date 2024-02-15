import { defineField } from "sanity";

export default defineField({
  name: "image",
  title: "Image",
  type: "accessibleImage",
  description: `An image to be shown alongside the resource (usually only shown when "Featured")`,
});

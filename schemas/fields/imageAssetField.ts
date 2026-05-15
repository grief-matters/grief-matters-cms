import { defineField } from "sanity";

export default defineField({
  name: "imageRef",
  title: "Image",
  type: "reference",
  to: [{ type: "imageAsset" }],
  description: `An image to be shown alongside the resource (usually only shown when "Featured")`,
});

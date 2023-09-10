import { defineField } from "sanity";

export default defineField({
  title: "Source Website",
  name: "sourceWebsite",
  description:
    "The website that this resource belongs to (not usually required if the website does not specialise in grief related matters)",
  type: "reference",
  to: [{ type: "website" }],
});

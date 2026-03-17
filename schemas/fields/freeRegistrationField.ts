import { defineField } from "sanity";

export default defineField({
  title: "Registration Required",
  description:
    "This marks the resource as 'free' but requiring site registration. Use paywalled if payment is required",
  name: "registrationRequired",
  type: "boolean",
  initialValue: false,
});

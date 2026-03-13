import { defineField } from "sanity";

export default defineField({
  title: "Skip Link Checking",
  description:
    "This will exclude the resource from being checked in the 'Broken Links' report",
  name: "skipLinkCheck",
  type: "boolean",
  initialValue: false,
});

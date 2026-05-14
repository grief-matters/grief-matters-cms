import { defineField } from "sanity";

export default defineField({
  title: "Skipped by AI Content Editor",
  description:
    "This setting is used to exclude the resource from being checked by the AI Content Editor agent. This should be set if the AI Content Editor is not able to read the resource (e.g. due to crawling restrictions on the host site)",
  name: "skipLinkCheck",
  type: "boolean",
  initialValue: false,
});

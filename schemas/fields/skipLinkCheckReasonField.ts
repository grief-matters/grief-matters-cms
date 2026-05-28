import { defineField } from "sanity";

export default defineField({
  title: "Skip Reason",
  description:
    "Automatically set by the AI Content Editor when it disables checking for this resource (e.g. robots.txt disallow, HTTP 4xx). Uncheck 'Skipped by AI Content Editor' to re-enable auditing.",
  name: "skipLinkCheckReason",
  type: "string",
  readOnly: true,
  hidden: ({ parent }) => parent?.skipLinkCheck !== true,
});

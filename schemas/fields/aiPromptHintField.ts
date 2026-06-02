import { defineField } from "sanity";

export default defineField({
  title: "AI Prompt Hint",
  name: "aiPromptHint",
  type: "text",
  rows: 3,
  description:
    "Will be used for prompting the AI Content Editor as to when to use this type as a reference. Keep it concise and research prompting best practices if unsure",
  validation: (rule) => rule.required(),
});

import { defineField } from "sanity";

export default defineField({
  title: "Quality Score Notes",
  description:
    "Rationale written by the AI Content Editor to justify the Quality Score (including why 'N/A' was chosen). Editorial context for the human approving the draft — not shown to users.",
  name: "qualityScoreNotes",
  type: "text",
  rows: 4,
  readOnly: true,
});

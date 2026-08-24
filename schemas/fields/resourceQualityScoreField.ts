import { defineField } from "sanity";

export default defineField({
  name: "qualityScore",
  title: "Quality Score",
  type: "number",
  description: `
• 9-10 — Flagship/exceptional
• 7-8 — Strong 
•	5-6 — Acceptable/serviceable
•	3-4 — Weak
•	1-2 — Remove or replace
`,
  options: {
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    layout: "radio",
    direction: "horizontal",
  },
  validation: (rule) => rule.required(),
});

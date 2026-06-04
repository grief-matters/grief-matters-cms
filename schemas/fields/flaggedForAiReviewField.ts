import { defineField } from "sanity";

export default defineField({
  title: "Flagged for AI Review",
  description:
    "Set this to request an off-cycle review by the AI Content Editor. The flag is cleared automatically after the next review completes. Cannot be set if 'Skipped by AI Content Editor' is enabled.",
  name: "flaggedForAiReview",
  type: "boolean",
  initialValue: false,
  validation: (rule) =>
    rule.custom((value, ctx) => {
      const parent = ctx.parent as { skipLinkCheck?: boolean } | undefined;
      if (value === true && parent?.skipLinkCheck === true) {
        return "Cannot flag for AI review while 'Skipped by AI Content Editor' is enabled.";
      }
      return true;
    }),
});

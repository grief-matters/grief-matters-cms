import { ConditionalPropertyCallbackContext, defineField } from "sanity";

export default defineField({
  title: "Changes are ready for review",
  name: "readyForReview",
  type: "boolean",
  initialValue: false,
  hidden: ({ document }: ConditionalPropertyCallbackContext) =>
    !document?._id.includes("draft"),
});

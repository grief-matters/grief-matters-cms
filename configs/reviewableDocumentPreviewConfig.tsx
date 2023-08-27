import { PreviewConfig } from "sanity";
import ReviewableDocumentPreview from "../components/ReviewableDocumentPreview";

export const reviewableDocumentPreviewConfig: PreviewConfig = {
  select: {
    name: "name",
    title: "title",
    inReview: "readyForReview",
  },
  prepare: ({ name, title, inReview }) => ({
    title: title ?? name,
    media: () => <ReviewableDocumentPreview inReview={inReview} />,
  }),
};

import { PreviewConfig } from "sanity";
import InternetResourcePreview from "../components/InternetResourcePreview";

export const internetResourcePreviewConfig: PreviewConfig = {
  select: {
    title: "title",
    validated: "validated",
  },
  prepare: ({ title, validated }) => ({
    title: title,
    media: () => <InternetResourcePreview validated={validated} />,
  }),
};

import { PreviewConfig } from "sanity";
import InternetResourcePreview from "../components/InternetResourcePreview";

export const internetResourcePreviewConfig: PreviewConfig = {
  select: {
    name: "name",
    title: "title",
    validated: "validated",
  },
  prepare: ({ name, title, validated }) => ({
    title: title ?? name,
    media: () => <InternetResourcePreview validated={validated} />,
  }),
};

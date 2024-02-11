import { PreviewConfig } from "sanity";

export const rowOfThreePreviewConfig: PreviewConfig = {
  select: {
    image: "images.0.image",
  },
  prepare: ({ image }) => ({
    title: "Row of Three",
    subtitle: "Row of three photos",
    media: image,
  }),
};

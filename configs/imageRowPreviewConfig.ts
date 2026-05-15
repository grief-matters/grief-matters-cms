import { PreviewConfig } from "sanity";

export const imageRowPreviewConfig: PreviewConfig = {
  select: {
    image: "imagesRef.0->image",
  },
  prepare: ({ image }) => ({
    title: "Image Row",
    subtitle: "Row of multiple images",
    media: image,
  }),
};

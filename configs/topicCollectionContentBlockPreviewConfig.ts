import { PreviewConfig } from "sanity";

export const topicCollectionContentBlockPreviewConfig: PreviewConfig = {
  select: {
    topicCollectionTitle: "topicCollection.title",
  },
  prepare: ({ topicCollectionTitle }) => {
    return {
      title: "Topic Collection",
      subtitle: topicCollectionTitle,
    };
  },
};

import type { PreviewConfig } from "sanity";

export const featuredResourceLinksPreviewConfig: PreviewConfig = {
  select: {
    resource0: "resources.0.title",
    resource1: "resources.1.title",
    resource2: "resources.2.title",
    resource3: "resources.3.title",
  },
  prepare: ({ resource0, resource1, resource2, resource3 }) => {
    const resourceTitles = [resource0, resource1, resource2, resource3].filter(
      Boolean
    );
    const subtitle =
      resourceTitles.length > 0 ? `${resourceTitles.join(", ")}` : "";
    const hasMoreLinks = Boolean(resource3);

    return {
      title: "Featured Resource Links Collection",
      subtitle: hasMoreLinks ? `${subtitle}…` : subtitle,
    };
  },
};

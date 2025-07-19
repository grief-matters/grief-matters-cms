import { definePlugin } from "sanity";
import { WebsiteTools } from "./WebsiteTools";

export default definePlugin({
  name: "website-management",
  tools: (prev) => [
    ...prev,
    {
      name: "website-tools",
      title: "Website Management",
      component: WebsiteTools,
    },
  ],
});

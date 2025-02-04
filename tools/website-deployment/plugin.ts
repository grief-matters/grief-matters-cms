import { definePlugin } from "sanity";
import { WebsiteDeployment } from "./WebsiteDeployment";

export default definePlugin({
  name: "website-deployment",
  tools: (prev) => [
    ...prev,
    {
      name: "website-deployment-tool",
      title: "Website Deployment",
      component: WebsiteDeployment,
    },
  ],
});

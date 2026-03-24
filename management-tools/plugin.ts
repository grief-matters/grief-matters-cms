import { definePlugin } from "sanity";
import { ManagementTools } from "./components/ManagementTools";

export default definePlugin({
  name: "management-tools",
  tools: (prev) => [
    ...prev,
    {
      name: "management-tools",
      title: "Management Tools",
      component: ManagementTools,
    },
  ],
});

import { DashboardWidget, LayoutConfig } from "@sanity/dashboard";
import CategoryTree from "./CategoryTree";

export interface CategoryTreeWidgetConfig {
  layout?: LayoutConfig;
}

export function categoryTreeWidget(
  config?: CategoryTreeWidgetConfig
): DashboardWidget {
  return {
    name: "category-tree-widget",
    component: function component() {
      return <CategoryTree />;
    },
    layout: config?.layout ?? { width: "small" },
  };
}

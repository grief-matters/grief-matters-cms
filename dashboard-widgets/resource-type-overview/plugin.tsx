import { DashboardWidget, LayoutConfig } from "@sanity/dashboard";
import ResourceTypeOverview, {
  type ResourceTypeOverviewProps,
} from "./ResourceTypeOverview";

export interface ResourceTypeOverviewWidgetConfig
  extends ResourceTypeOverviewProps {
  layout?: LayoutConfig;
}

export function resourceTypeOverviewWidget(
  config: ResourceTypeOverviewWidgetConfig
): DashboardWidget {
  return {
    name: "resource-type-overview-widget",
    component: function component() {
      return <ResourceTypeOverview {...config} />;
    },
    layout: config.layout ?? { width: "small" },
  };
}

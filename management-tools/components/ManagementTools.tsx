import { Box, Grid, Heading } from "@sanity/ui";
import ResourceTypeOverview from "../../dashboard-widgets/resource-type-overview/ResourceTypeOverview";
import CategoryTree from "../../dashboard-widgets/category-tree/CategoryTree";
import WebsiteDeployment from "./WebsiteDeployment";
import BrokenLinks from "./BrokenLinks";

export const ManagementTools = () => {
  return (
    <Box padding={4}>
      <Heading as="h1" size={3}>
        Management Tools
      </Heading>
      <Box marginY={5}>
        <Grid columns={[1, 1, 2]} gap={4}>
          <ResourceTypeOverview />
          <CategoryTree />
          <WebsiteDeployment />
          <BrokenLinks />
        </Grid>
      </Box>
    </Box>
  );
};

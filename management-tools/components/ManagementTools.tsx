import { Box, Grid, Heading } from "@sanity/ui";
import ResourceTypeOverview from "./ResourceTypeOverview";
import WebsiteDeployment from "./WebsiteDeployment";
import BrokenLinks from "./BrokenLinks";
import CategoryTree from "./CategoryTree";
import UnderservedPopulationsOverview from "./UnderservedPopulationsOverview";

export const ManagementTools = () => {
  return (
    <Box padding={4}>
      <Heading as="h1" size={3}>
        Management Tools
      </Heading>
      <Box marginY={5}>
        <Grid columns={[1, 1, 2]} gap={4}>
          <ResourceTypeOverview />
          <UnderservedPopulationsOverview />
          <CategoryTree />
          <WebsiteDeployment />
          <BrokenLinks />
        </Grid>
      </Box>
    </Box>
  );
};

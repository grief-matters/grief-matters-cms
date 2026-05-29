import { Box, Grid, Heading } from "@sanity/ui";
import ResourceTypeOverview from "./ResourceTypeOverview";

export const ManagementTools = () => {
  return (
    <Box padding={4}>
      <Heading as="h1" size={3}>
        Management Tools
      </Heading>
      <Box marginY={5}>
        <Grid columns={[1, 1, 2]} gap={4}>
          <ResourceTypeOverview />
        </Grid>
      </Box>
    </Box>
  );
};

import { Box, Card, Container, Flex, Heading } from "@sanity/ui";
import WebsiteDeployment from "./WebsiteDeployment";
import BrokenLinks from "./BrokenLinks";

export const WebsiteTools = () => {
  return (
    <Box>
      <Card padding={3} borderBottom>
        <Heading as="h2" size={1}>
          Website Management
        </Heading>
      </Card>
      <Card>
        <Flex wrap="wrap">
          <Box>
            <WebsiteDeployment />
          </Box>
          <Box flex={1}>
            <BrokenLinks />
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

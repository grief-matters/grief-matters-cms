import React from "react";
import { Card, Heading, Stack, Text } from "@sanity/ui";

export const BrokenLinks = () => {
  return (
    <Card border padding={4} margin={3}>
      <Stack space={4}>
        <Heading as="h3" size={2}>
          Broken Links
        </Heading>
        <Text>
          Tools and information regarding the current state of broken links
          across the website
        </Text>
        <Card padding={4} border tone="positive">
          <Text>Coming Soon</Text>
        </Card>
      </Stack>
    </Card>
  );
};

export default BrokenLinks;

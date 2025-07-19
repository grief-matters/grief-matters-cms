import React, { useState } from "react";
import { RocketIcon } from "@sanity/icons";
import { Box, Button, Card, Heading, Spinner, Stack, Text } from "@sanity/ui";

const SpinnerIconComponent = () => (
  <Box
    style={{
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Spinner muted />
  </Box>
);

export const WebsiteDeployment = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleClick = async () => {
    setSubmitting(true);
    try {
      await fetch("/cfw-api/website-deploy");
    } catch (error) {
      console.error("Error triggering deploy:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card border padding={4} margin={3}>
      <Stack space={4}>
        <Heading as="h3" size={2}>
          Website Deployment
        </Heading>
        <Text>
          Tools and information regarding the current deployment state of the
          website
        </Text>
        <Card border padding={3}>
          <Stack space={4}>
            <Heading as="h3" size={1}>
              Deploy Website
            </Heading>
            <Text>Re-deploy the website using the current main branch</Text>
            <Box>
              <Button
                icon={submitting ? SpinnerIconComponent : RocketIcon}
                disabled={submitting}
                onClick={handleClick}
                text={"Deploy Website"}
                fontSize={2}
                paddingX={4}
              />
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};

export default WebsiteDeployment;

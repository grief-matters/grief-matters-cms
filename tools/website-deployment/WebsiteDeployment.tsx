import { Button, Card, Container } from "@sanity/ui";
import React from "react";

export const WebsiteDeployment = () => {
  const handleClick = async () => {
    try {
      await fetch("/website-deploy");
    } catch (error) {
      console.error("Error triggering deploy:", error);
    }
  };

  return (
    <Container>
      <Card margin={3} padding={3}>
        <Button onClick={handleClick}>Deploy Website</Button>
      </Card>
    </Container>
  );
};

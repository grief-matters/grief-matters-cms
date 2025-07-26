import React, { useEffect, useState } from "react";
import { RocketIcon } from "@sanity/icons";
import { Box, Button, Card, Heading, Spinner, Stack, Text } from "@sanity/ui";
import {
  deployWebsite,
  getDeployment,
  getLatestDeployment,
} from "../api-client/api-client";
import { Deployment } from "cloudflare/resources/pages/projects/projects";
import DeploymentDetails from "./DeploymentDetails";

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
  const [deploying, setDeploying] = useState<boolean>(false);

  const [latestDeployment, setLatestDeployment] = useState<Deployment | null>(
    null
  );
  const [latestDeploymentError, setLatestDeploymentError] =
    useState<Error | null>(null);

  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(
    null
  );
  const [currentDeploymentError, setCurrentDeploymentError] =
    useState<Error | null>(null);

  useEffect(() => {
    const fetchFunc = async () => {
      try {
        setLatestDeployment(null);
        const d = await getLatestDeployment();
        if (!ignore) {
          setLatestDeployment(d);
        }
      } catch (_) {
        setLatestDeploymentError(new Error("Failed to get latest deployment"));
      }
    };

    let ignore = false;
    fetchFunc();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!deploying || !currentDeployment) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        if (typeof currentDeployment.id === "undefined") {
          throw new Error("Could not get current deployment");
        }

        const d = await getDeployment(currentDeployment.id);
        setCurrentDeployment(d);

        if (
          d.latest_stage?.name === "deploy" &&
          d.latest_stage.status === "success"
        ) {
          setDeploying(false);
          setLatestDeployment(d);
          setCurrentDeployment(null);
        }
      } catch (error) {
        setCurrentDeploymentError(new Error("Error polling deployment"));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [deploying, currentDeployment]);

  const handleDeployClick = async () => {
    setDeploying(true);

    try {
      const deployment = await deployWebsite();
      setCurrentDeployment(deployment ?? null);
    } catch (_) {
      setCurrentDeploymentError(new Error("Could not get current deployment"));
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
              Latest Deployment
            </Heading>
            <Text>Information on latest deployment</Text>
            {latestDeploymentError ? (
              <Card border padding={3} tone="critical">
                {latestDeploymentError.message}
              </Card>
            ) : (
              <DeploymentDetails
                createdOn={
                  latestDeployment?.created_on
                    ? new Date(latestDeployment?.created_on).toLocaleString()
                    : "Unknown"
                }
                status={"success"}
                stage={null}
              />
            )}
          </Stack>
        </Card>
        <Card border padding={3}>
          <Stack space={4}>
            <Heading as="h3" size={1}>
              Deploy Website
            </Heading>
            <Text>Re-deploy the website using the current main branch</Text>
            <Box>
              <Button
                icon={deploying ? SpinnerIconComponent : RocketIcon}
                disabled={deploying}
                onClick={handleDeployClick}
                text={"Deploy Website"}
                fontSize={2}
                paddingX={4}
              />
            </Box>
            {deploying &&
              (currentDeploymentError ? (
                <Card border padding={3} tone="critical">
                  {currentDeploymentError.message}
                </Card>
              ) : (
                <DeploymentDetails
                  createdOn={
                    currentDeployment?.modified_on
                      ? new Date(
                          currentDeployment?.modified_on
                        ).toLocaleString()
                      : "Unknown"
                  }
                  stage={currentDeployment?.latest_stage?.name ?? null}
                  status={currentDeployment?.latest_stage?.status ?? null}
                />
              ))}
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};

export default WebsiteDeployment;

import { useEffect, useState } from "react";
import { RocketIcon } from "@sanity/icons";
import { Box, Button, Card, Heading, Spinner, Stack, Text } from "@sanity/ui";
import {
  deployWebsite,
  getDeployment,
  getLatestDeployment,
} from "../api-client/api-client";
import type { Build } from "../../shared/types/build";
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

  const [latestBuild, setLatestBuild] = useState<Build | null>(null);
  const [latestBuildError, setLatestBuildError] = useState<Error | null>(null);

  const [currentBuild, setCurrentBuild] = useState<Build | null>(null);
  const [currentBuildError, setCurrentBuildError] = useState<Error | null>(
    null
  );

  useEffect(() => {
    const fetchFunc = async () => {
      try {
        setLatestBuild(null);
        const b = await getLatestDeployment();
        if (!ignore) {
          setLatestBuild(b);
        }
      } catch (_) {
        setLatestBuildError(new Error("Failed to get latest build"));
      }
    };

    let ignore = false;
    fetchFunc();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!deploying || !currentBuild) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const b = await getDeployment(currentBuild.build_uuid);
        setCurrentBuild(b);

        if (b.status === "stopped") {
          setDeploying(false);
          setLatestBuild(b);
          setCurrentBuild(null);
        }
      } catch (error) {
        setCurrentBuildError(new Error("Error polling build"));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [deploying, currentBuild]);

  const handleDeployClick = async () => {
    setDeploying(true);

    try {
      const build = await deployWebsite();
      setCurrentBuild(build ?? null);
    } catch (_) {
      setCurrentBuildError(new Error("Could not trigger build"));
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
            {latestBuildError ? (
              <Card border padding={3} tone="critical">
                {latestBuildError.message}
              </Card>
            ) : (
              <DeploymentDetails
                createdAt={
                  latestBuild?.created_on
                    ? new Date(latestBuild.created_on).toLocaleString()
                    : "Unknown"
                }
                status={latestBuild?.status ?? null}
                buildOutcome={latestBuild?.build_outcome ?? null}
              />
            )}
          </Stack>
        </Card>
        <Card border padding={3}>
          <Stack space={4}>
            <Heading as="h3" size={1}>
              Deploy Website
            </Heading>
            <Text>Deploy the website using the current main branch</Text>
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
              (currentBuildError ? (
                <Card border padding={3} tone="critical">
                  {currentBuildError.message}
                </Card>
              ) : (
                <DeploymentDetails
                  createdAt={
                    currentBuild?.created_on
                      ? new Date(currentBuild.created_on).toLocaleString()
                      : "Unknown"
                  }
                  status={currentBuild?.status ?? null}
                  buildOutcome={currentBuild?.build_outcome ?? null}
                />
              ))}
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};

export default WebsiteDeployment;

import { Card, Stack, Label, Badge, type BadgeTone } from "@sanity/ui";

type DeploymentStatus = "success" | "idle" | "active" | "failure" | "canceled";

const deploymentStateToToneMap: Record<string, BadgeTone | undefined> = {
  success: "positive",
  idle: "caution",
  active: "primary",
  failure: "critical",
  canceled: undefined,
};

interface Props {
  createdOn: string;
  status: DeploymentStatus | null;
  stage: string | null;
}

const DeploymentDetails = (props: Props) => {
  return (
    <Card border padding={3}>
      <Stack space={4}>
        <Stack space={3}>
          <Label>Date</Label>
          <div>
            <Badge radius={1}>{props.createdOn}</Badge>
          </div>
        </Stack>
        {props.stage && (
          <Stack space={3}>
            <Label>Stage</Label>
            <div>
              <Badge padding={1} radius={1}>
                {props.stage ?? "Unknown"}
              </Badge>
            </div>
          </Stack>
        )}
        <Stack space={3}>
          <Label>Status</Label>
          <div>
            <Badge
              padding={1}
              radius={1}
              tone={deploymentStateToToneMap[props.status ?? "canceled"]}
            >
              {props.status ?? "Unknown"}
            </Badge>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DeploymentDetails;

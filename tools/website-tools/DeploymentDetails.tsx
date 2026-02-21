import { Card, Stack, Label, Badge, type BadgeTone } from "@sanity/ui";
import type { BuildStatus, BuildOutcome } from "../../shared/types/build";

const outcomeToneMap: Record<BuildOutcome, BadgeTone | undefined> = {
  success: "positive",
  fail: "critical",
  cancelled: "caution",
  terminated: "caution",
  skipped: undefined,
};

const statusToneMap: Record<BuildStatus, BadgeTone | undefined> = {
  running: "primary",
  initializing: "primary",
  queued: "caution",
  stopped: undefined,
};

interface Props {
  createdAt: string;
  status: BuildStatus | null;
  buildOutcome: BuildOutcome | null;
}

const DeploymentDetails = (props: Props) => {
  const displayLabel = props.buildOutcome ?? props.status;
  const tone = props.buildOutcome
    ? outcomeToneMap[props.buildOutcome]
    : props.status
      ? statusToneMap[props.status]
      : undefined;

  return (
    <Card border padding={3}>
      <Stack space={4}>
        <Stack space={3}>
          <Label>Date</Label>
          <div>
            <Badge radius={1}>{props.createdAt}</Badge>
          </div>
        </Stack>
        <Stack space={3}>
          <Label>Status</Label>
          <div>
            <Badge padding={1} radius={1} tone={tone}>
              {displayLabel ?? "Unknown"}
            </Badge>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DeploymentDetails;

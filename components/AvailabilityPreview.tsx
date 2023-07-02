import { Card, Stack, Text } from "@sanity/ui";
import React from "react";
import { PreviewLayoutKey, PreviewProps, useFormValue } from "sanity";

type CastPreviewProps = PreviewProps & {
  days?: any;
  from?: string;
  to?: string;
  timezone?: string;
};

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function AvailabilityPreview(props: PreviewProps) {
  const castProps = props as CastPreviewProps;
  const { days, from, to, timezone } = castProps;

  let daysText;

  if (days?.length === 7) {
    daysText = "7 days a week";
  } else if (days?.every((e: string) => weekdays.includes(e))) {
    daysText = "Weekdays";
  }

  const hoursText =
    to === "00:00" && from === "00:00" ? "24 hours a day" : `${from} - ${to}`;

  return (
    <Stack space={2}>
      <Text cellPadding={2}>{daysText}</Text>
      <Text muted size={1}>
        {hoursText} {timezone && `(${timezone})`}
      </Text>
    </Stack>
  );
}

export default AvailabilityPreview;

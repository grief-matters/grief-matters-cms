import React, { useCallback } from "react";
import { NumberInputProps, PatchEvent, unset } from "sanity";
import { Button, Inline, Stack } from "@sanity/ui";
import { ResetIcon } from "@sanity/icons";

function RatingInput(props: NumberInputProps) {
  const { onChange } = props;

  const handleReset = useCallback(() => {
    onChange(PatchEvent.from(unset()));
  }, [onChange]);

  const isDisabled = typeof props.value !== "number";

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Inline>
        <Button
          disabled={isDisabled}
          icon={ResetIcon}
          mode="bleed"
          text="Reset Rating"
          tone="critical"
          onClick={handleReset}
        />
      </Inline>
    </Stack>
  );
}

export default RatingInput;

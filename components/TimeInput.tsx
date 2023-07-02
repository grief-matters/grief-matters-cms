import React, { useCallback } from "react";
import { StringInputProps, set, unset } from "sanity";
import "react-time-picker/dist/TimePicker.css";

function TimeInput(props: StringInputProps) {
  const { onChange, value = "", elementProps } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        event.currentTarget.value ? set(event.currentTarget.value) : unset()
      ),
    [onChange]
  );

  return (
    <input
      {...elementProps}
      type="time"
      onChange={handleChange}
      value={value}
    />
  );
}

export default TimeInput;

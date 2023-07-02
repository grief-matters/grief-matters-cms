import React from "react";
import { PreviewProps, useFormValue } from "sanity";

type CastPreviewProps = PreviewProps & {
  days?: any;
  from?: string;
  to?: string;
};

function TimePreview(props: PreviewProps) {
  const castProps = props as CastPreviewProps;
  const { days, from, to } = castProps;

  return <div>preview of time: {from}</div>;
}

export default TimePreview;

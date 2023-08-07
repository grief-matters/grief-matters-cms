import React from "react";
import { CheckmarkCircleIcon } from "@sanity/icons";

interface InternetResourcePreviewProps {
  validated: boolean;
}

function InternetResourcePreview({ validated }: InternetResourcePreviewProps) {
  return validated ? (
    <CheckmarkCircleIcon style={{ color: "green" }} />
  ) : (
    <CheckmarkCircleIcon style={{ color: "#eeefff" }} />
  );
}

export default InternetResourcePreview;

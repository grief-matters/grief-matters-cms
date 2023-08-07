import React from "react";
import { CheckmarkCircleIcon, RemoveCircleIcon } from "@sanity/icons";

interface InternetResourcePreviewProps {
  validated: boolean;
}

function InternetResourcePreview({ validated }: InternetResourcePreviewProps) {
  return validated ? (
    <CheckmarkCircleIcon style={{ color: "green" }} />
  ) : (
    <RemoveCircleIcon style={{ color: "#eee" }} />
  );
}

export default InternetResourcePreview;

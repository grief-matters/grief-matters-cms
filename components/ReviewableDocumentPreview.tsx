import React from "react";
import { ClockIcon } from "@sanity/icons";
import { Box, Tooltip, Text } from "@sanity/ui";

interface ReviewableDocumentPreviewProps {
  inReview: boolean;
}

function ReviewableDocumentPreview({
  inReview,
}: ReviewableDocumentPreviewProps) {
  return inReview ? (
    <Tooltip
      portal
      content={
        <Box padding={2}>
          <Text muted size={1}>
            Unpublished changes awaiting review
          </Text>
        </Box>
      }
    >
      <ClockIcon style={{ color: "purple" }} />
    </Tooltip>
  ) : (
    <ClockIcon style={{ color: "#eee" }} />
  );
}

export default ReviewableDocumentPreview;

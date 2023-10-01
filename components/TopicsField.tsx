import { Heading, Stack, Text } from "@sanity/ui";
import React from "react";
import { ArrayFieldProps } from "sanity";

function TopicsField(props: ArrayFieldProps) {
  const { title, description, ...restProps } = props;
  return (
    <Stack space={4}>
      <Heading as="h3">{title}</Heading>
      <Text size={2}>
        {`Featured Topics will appear as a top-level navigation item on the website.`}
      </Text>
      <Text size={2}>
        {`It is a special document type that allows us to select existing categories, or collect categories and resources under a new title.`}
      </Text>
      {props.renderDefault(restProps as any)}
    </Stack>
  );
}

export default TopicsField;

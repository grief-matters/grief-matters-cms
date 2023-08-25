import React from "react";
import { UrlInputProps } from "sanity";
import { Flex, Stack, Text } from "@sanity/ui";
import { ArrowRightIcon } from "@sanity/icons";

function ResourceUrlInput(props: UrlInputProps) {
  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Flex justify={"flex-end"}>
        <Text size={2}>
          <a href={`${props.value}`} target="blank" rel="noopener">
            Go to resource <ArrowRightIcon />
          </a>
        </Text>
      </Flex>
    </Stack>
  );
}

export default ResourceUrlInput;
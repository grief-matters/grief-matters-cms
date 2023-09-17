import { EnterRightIcon } from "@sanity/icons";
import { Flex, Stack, Text } from "@sanity/ui";
import React from "react";
import { PreviewProps } from "sanity";

type CastPreviewProps = PreviewProps & {
  title?: any;
  parent1?: any;
  parent2?: any;
  parent3?: any;
};

function extractParents(props: CastPreviewProps) {
  const parents = [];
  for (let i = 1; i <= 3; i++) {
    const parentKey: keyof CastPreviewProps =
      `parent${i}` as keyof CastPreviewProps;
    if (props[parentKey]) {
      parents.push(props[parentKey]);
    }
  }
  return parents;
}

function CategoryPreview(props: any) {
  const castProps: CastPreviewProps = props as CastPreviewProps;
  const parents = extractParents(castProps);

  return (
    <Stack space={2} height={"fill"}>
      {parents.reverse().map((p, i) => (
        <Flex
          key={`parent-${i}`}
          direction={"row"}
          align={"center"}
          paddingLeft={i * 2}
        >
          {i > 0 && <EnterRightIcon color="grey" />}
          <Text size={1} muted>
            {p}
          </Text>
        </Flex>
      ))}
      <Flex direction={"row"} paddingLeft={parents.length * 1 * 2}>
        {parents.length > 0 && <EnterRightIcon color="grey" />}
        <Text size={3} weight="semibold">
          {castProps.title}
        </Text>
      </Flex>
    </Stack>
  );
}

export default CategoryPreview;

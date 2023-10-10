import { Card, Stack, Text } from "@sanity/ui";
import React from "react";
import { StringFieldProps } from "sanity";

function FilterOperatorField(props: StringFieldProps) {
  const { description, title, ...restProps } = props;
  return (
    <Card>
      <Stack space={3} marginBottom={3}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
        <Stack space={4}>
          <Text size={1} muted>
            {`The 'Resource Filter' determines which resources from the selected 'Categories' will be included in this smart-category`}
          </Text>
          <Text size={1} muted>
            Selecting <strong>OR</strong> will include any resource that appears
            within <strong>any</strong> of the categories selected.
          </Text>
          <Text size={1} muted>
            Selecting <strong>AND</strong> will include any resource that
            appears within <strong>all</strong> of the categories selected.
          </Text>
        </Stack>
      </Stack>
      {props.renderDefault(restProps as StringFieldProps)}
    </Card>
  );
}

export default FilterOperatorField;

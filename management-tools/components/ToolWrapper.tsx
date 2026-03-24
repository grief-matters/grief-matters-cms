import { Box, Card, Heading, Stack, Text } from "@sanity/ui";
import styled from "styled-components";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ScrollableBox = styled(Box)`
  max-height: 50rem;
  overflow-y: auto;
`;

const ToolWrapper = (props: Props) => {
  return (
    <Card border radius={2} padding={4}>
      <Stack space={3}>
        <Stack space={3} marginBottom={3}>
          <Heading as="h2" size={2}>
            {props.title}
          </Heading>
          {props.description && <Text size={1}>{props.description}</Text>}
        </Stack>
        <ScrollableBox>
          <Stack space={4}>{props.children}</Stack>
        </ScrollableBox>
      </Stack>
    </Card>
  );
};

export default ToolWrapper;

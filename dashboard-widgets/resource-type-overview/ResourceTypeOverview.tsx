import { startCase } from "lodash";
import pluralize from "pluralize";

import { DashboardWidgetContainer } from "@sanity/dashboard";
import {
  Box,
  Card,
  Container,
  Grid,
  Heading,
  Inline,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";
import { Feedback, useListeningQuery } from "sanity-plugin-utils";

import { INTERNET_RESOURCE_TYPES } from "../../constants";

type Overview = {
  type: string | null;
  total: number | null;
  published: number | null;
  draft: number | null;
  awaitingReview: number | null;
};

function ResourceTypeOverview() {
  const queryStringParts = [...INTERNET_RESOURCE_TYPES, "website"].map(
    (type) => `{
    "type": "${type}",
    "total": count(*[_type == "${type}"]),
    "published": count(*[_type == "${type}" && !(_id in path("drafts.**"))]),
    "draft": count(*[_type == "${type}" && (_id in path("drafts.**"))]),
  }`
  );

  const queryString = `[${queryStringParts.join(",")}]`;

  const { data, loading, error } = useListeningQuery<Overview[]>(queryString, {
    params: {},
    initialValue: [],
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Feedback tone="critical">{error as string}</Feedback>;
  }

  return (
    <DashboardWidgetContainer header="Publishing Overview">
      <Container height="fill" width="auto">
        <Box padding={3}>
          <Card border tone="positive" padding={2} radius={2}>
            <Heading as={"h3"} size={1}>
              Key Terms
            </Heading>
            <Stack space={3} marginTop={3}>
              <Inline space={1}>
                <Text size={1} weight="bold">
                  Total
                </Text>
                <Text size={1}>
                  Total number of resources, regardless of state.
                </Text>
              </Inline>

              <Inline space={1}>
                <Text size={1} weight="bold">
                  Published
                </Text>
                <Text size={1}>
                  Total number of resources that have a currently published
                  version.
                </Text>
              </Inline>

              <Inline space={1}>
                <Text size={1} weight="bold">
                  Drafts
                </Text>
                <Text size={1}>
                  Total number of resources with unpublished changes (may have a
                  previously published version still active).
                </Text>
              </Inline>
            </Stack>
          </Card>
        </Box>
        <Grid columns={[2, 4]} padding={3} gap={4}>
          {data?.map((overview) => (
            <Card border={true} key={overview.type} padding={3}>
              <Stack space={3}>
                <Heading as="h4" size={1}>
                  {startCase(pluralize(overview?.type ?? ""))}:
                </Heading>
                <Text>Total: {overview.total}</Text>
                <Text>Published: {overview.published}</Text>
                <Text>Draft: {overview.draft}</Text>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Container>
    </DashboardWidgetContainer>
  );
}

export default ResourceTypeOverview;

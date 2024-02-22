import { startCase } from "lodash";
import pluralize from "pluralize";
import { DashboardWidgetContainer } from "@sanity/dashboard";
import { Card, Grid, Spinner, Stack, Text } from "@sanity/ui";
import { Feedback, useListeningQuery } from "sanity-plugin-utils";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

type Overview = {
  type: string | null;
  total: number | null;
  published: number | null;
  awaitingReview: number | null;
};

export interface ResourceTypeOverviewProps {}

function ResourceTypeOverview(props: ResourceTypeOverviewProps) {
  const queryStringParts = INTERNET_RESOURCE_TYPES.map(
    (type) => `{
    "type": "${type}",
    "total": count(*[_type == "${type}"]),
    "published": count(*[_type == "${type}" && !(_id in path("drafts.**"))]),
    "awaitingReview": count(*[_type == "${type}" && readyForReview == true]),
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
      <Grid columns={[2, 4]} padding={3} gap={4}>
        {data?.map((overview) => (
          <Card border={true} key={overview.type} padding={3}>
            <Stack space={3}>
              <Text weight="medium" size={4}>
                {startCase(pluralize(overview?.type ?? ""))}:
              </Text>
              <Text>Total: {overview.total}</Text>
              <Text>Published: {overview.published}</Text>
              <Text>Awaiting Review: {overview.awaitingReview}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </DashboardWidgetContainer>
  );
}

export default ResourceTypeOverview;

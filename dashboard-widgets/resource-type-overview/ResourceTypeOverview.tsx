import { startCase } from "lodash";
import pluralize from "pluralize";

import { Card, Grid, Heading, Inline, Spinner, Stack, Text } from "@sanity/ui";
import { Feedback, useListeningQuery } from "sanity-plugin-utils";

import { INTERNET_RESOURCE_TYPES } from "../../constants";
import ToolWrapper from "../../management-tools/components/ToolWrapper";

type Overview = {
  type: string | null;
  total: number | null;
  published: number | null;
  draft: number | null;
  awaitingReview: number | null;
};

export interface ResourceTypeOverviewProps {
  resourceTypes?: string[];
  title?: string;
}

const ResourceTypeOverview = ({
  resourceTypes = [...INTERNET_RESOURCE_TYPES, "website"],
  title = "Publishing Overview",
}: ResourceTypeOverviewProps) => {
  const queryStringParts = resourceTypes.map(
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
    <ToolWrapper title={title}>
      <Card border tone="positive" padding={2} radius={2}>
        <Heading as={"h4"} size={0}>
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
              Total number of resources that have a currently published version.
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
      <Grid columns={[2, 4]} gap={4}>
        {(data as Overview[])?.map((overview: Overview) => (
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
    </ToolWrapper>
  );
};

export default ResourceTypeOverview;

import { startCase } from "lodash";
import pluralize from "pluralize";
import styled from "styled-components";

import { Spinner, Text } from "@sanity/ui";
import { Feedback, useListeningQuery } from "sanity-plugin-utils";

import { INTERNET_RESOURCE_TYPES } from "../../constants";
import ToolWrapper from "./ToolWrapper";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  th {
    border-bottom: 2px solid var(--card-border-color);
  }

  td {
    border-bottom: 1px solid var(--card-border-color);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

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
      <StyledTable>
        <thead>
          <tr>
            <th>
              <Text size={1} weight="bold">
                Type
              </Text>
            </th>
            <th>
              <Text size={1} weight="bold">
                Total
              </Text>
            </th>
            <th>
              <Text size={1} weight="bold">
                Published
              </Text>
            </th>
            <th>
              <Text size={1} weight="bold">
                Draft
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {(data as Overview[])?.map((overview: Overview) => (
            <tr key={overview.type}>
              <td>
                <Text size={1}>
                  {startCase(pluralize(overview?.type ?? ""))}
                </Text>
              </td>
              <td>
                <Text size={1}>{overview.total}</Text>
              </td>
              <td>
                <Text size={1}>{overview.published}</Text>
              </td>
              <td>
                <Text size={1}>{overview.draft}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </ToolWrapper>
  );
};

export default ResourceTypeOverview;

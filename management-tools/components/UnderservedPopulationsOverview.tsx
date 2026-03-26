import startCase from "lodash/startCase";
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

  th.type > div[data-ui="Text"] > span {
    writing-mode: sideways-lr;
  }

  td {
    border-bottom: 1px solid var(--card-border-color);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

type PopulationOverview = {
  _id: string;
  name: string;
  total: number;
  [resourceType: string]: string | number;
};

const perTypeCounts = INTERNET_RESOURCE_TYPES.map(
  (type) => `"${type}": count(*[_type == "${type}" && references(^._id)])`
).join(",\n  ");

const query = `*[_type == "population" && underserved == true] | order(name asc) {
  _id,
  name,
  "total": count(*[_type in $resourceTypes && references(^._id)]),
  ${perTypeCounts}
}`;

const UnderservedPopulationsOverview = () => {
  const { data, loading, error } = useListeningQuery<PopulationOverview[]>(
    query,
    {
      params: { resourceTypes: [...INTERNET_RESOURCE_TYPES] },
      initialValue: [],
    }
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Feedback tone="critical">{error as string}</Feedback>;
  }

  return (
    <ToolWrapper
      title="Underserved Populations Overview"
      description="Showing distribution of resources across our underserved groups, broken down by type"
    >
      <StyledTable>
        <thead>
          <tr>
            <th>
              <Text size={1} weight="bold">
                Population
              </Text>
            </th>
            <th>
              <Text size={1} weight="bold">
                Total
              </Text>
            </th>
            {INTERNET_RESOURCE_TYPES.map((type) => (
              <th className="type" key={type}>
                <Text size={0} weight="bold">
                  {startCase(pluralize(type))}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data as PopulationOverview[])?.map((pop) => (
            <tr key={pop._id}>
              <td>
                <Text size={1}>{pop.name}</Text>
              </td>
              <td>
                <Text size={1}>{pop.total}</Text>
              </td>
              {INTERNET_RESOURCE_TYPES.map((type) => (
                <td key={type}>
                  <Text size={1}>{pop[type] as number}</Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </ToolWrapper>
  );
};

export default UnderservedPopulationsOverview;

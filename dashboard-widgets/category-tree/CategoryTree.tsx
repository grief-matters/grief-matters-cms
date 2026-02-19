import { useCallback, useState } from "react";

import { DashboardWidgetContainer } from "@sanity/dashboard";
import { Box, Inline, Spinner, Button, Stack } from "@sanity/ui";
import styled from "styled-components";
import { Feedback, useListeningQuery } from "sanity-plugin-utils";
import { useRouter } from "sanity/router";
import {
  AddIcon,
  ArrowTopRightIcon,
  CloseIcon,
  RemoveIcon,
} from "@sanity/icons";

type CategoryNode = {
  _id: string;
  title: string;
  subtopicIds: string[];
};

const ScrollableBox = styled(Box)`
  max-height: 50rem;
  overflow-y: auto;
`;

const QUERY = `*[_type == "category"] { _id, title, "subtopicIds": subtopics[]._ref }`;

const CategoryTree = () => {
  const router = useRouter();

  const { data, loading, error } = useListeningQuery<CategoryNode[]>(QUERY, {
    params: {},
    initialValue: [],
  });

  const navigateToCategory = useCallback(
    (id: string) => {
      router.navigateIntent("edit", { id, type: "category" });
    },
    [router]
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Feedback tone="critical">{error as string}</Feedback>;
  }

  const categories = (data ?? []) as CategoryNode[];
  const categoryMap = new Map(categories.map((c) => [c._id, c]));
  const childIds = new Set(categories.flatMap((c) => c.subtopicIds ?? []));
  const roots = categories.filter((c) => !childIds.has(c._id));

  return (
    <DashboardWidgetContainer header="Category Tree">
      <ScrollableBox padding={3}>
        {roots.map((root) => (
          <CategoryTreeItem
            key={root._id}
            category={root}
            categoryMap={categoryMap}
            onNavigate={navigateToCategory}
          />
        ))}
      </ScrollableBox>
    </DashboardWidgetContainer>
  );
};

function CategoryTreeItem({
  category,
  categoryMap,
  onNavigate,
}: {
  category: CategoryNode;
  categoryMap: Map<string, CategoryNode>;
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showLinkIcon, setShowLinkIcon] = useState(false);

  const children = (category.subtopicIds ?? [])
    .map((id) => categoryMap.get(id))
    .filter((c): c is CategoryNode => Boolean(c));

  const hasChildren = children.length > 0;

  const icon = hasChildren ? (expanded ? RemoveIcon : AddIcon) : CloseIcon;

  return (
    <Stack space={1}>
      <Box>
        <Inline space={2}>
          {hasChildren && (
            <Button
              mode="bleed"
              fontSize={0}
              aria-label="Expand Category"
              icon={icon}
              padding={2}
              onClick={() => setExpanded(!expanded)}
              disabled={!hasChildren}
            />
          )}
          <Box paddingY={1} paddingLeft={!hasChildren ? 5 : undefined}>
            <Button
              padding={2}
              mode="bleed"
              onClick={() => onNavigate(category._id)}
              onMouseEnter={() => setShowLinkIcon(true)}
              onMouseLeave={() => setShowLinkIcon(false)}
              iconRight={showLinkIcon ? ArrowTopRightIcon : undefined}
              text={category.title}
            />
          </Box>
        </Inline>
        {expanded &&
          hasChildren &&
          children.map((child) => (
            <Box key={child._id} marginLeft={3}>
              <CategoryTreeItem
                category={child}
                categoryMap={categoryMap}
                onNavigate={onNavigate}
              />
            </Box>
          ))}
      </Box>
    </Stack>
  );
}

export default CategoryTree;

import { defineArrayMember, defineField } from "sanity";
import type { CustomValidator } from "sanity";

type ThemeRef = { _ref: string };

const validateNoAncestorDescendantPairs: CustomValidator<
  ThemeRef[] | undefined
> = async (themes, context) => {
  if (!themes || themes.length < 2) {
    return true;
  }

  const ids = themes
    .map((t) => t?._ref)
    .filter((id): id is string => typeof id === "string");

  if (ids.length < 2) {
    return true;
  }

  const client = context.getClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  });

  const docs = await client.fetch<
    {
      _id: string;
      label: string;
      parentId: string | null;
      grandparentId: string | null;
    }[]
  >(
    `*[_type == "theme" && _id in $ids]{
      _id,
      "label": coalesce(displayTitle, title, _id),
      "parentId": parentTheme._ref,
      "grandparentId": parentTheme->parentTheme._ref
    }`,
    { ids }
  );

  const labelById = new Map(docs.map((d) => [d._id, d.label]));
  const selected = new Set(ids);
  const conflicts: string[] = [];

  for (const doc of docs) {
    const ancestors = [doc.parentId, doc.grandparentId].filter(
      (x): x is string => typeof x === "string"
    );
    for (const ancestorId of ancestors) {
      if (selected.has(ancestorId)) {
        const ancestorLabel = labelById.get(ancestorId) ?? ancestorId;
        conflicts.push(
          `"${doc.label}" is more specific than "${ancestorLabel}"`
        );
      }
    }
  }

  if (conflicts.length === 0) {
    return true;
  }
  return `Cannot tag both a theme and one of its parent themes. Choose only the most specific theme: ${conflicts.join(
    "; "
  )}.`;
};

export default defineField({
  name: "themes",
  title: "Themes",
  type: "array",
  description:
    "Themes or themes covered by this resource (e.g. anger, self-care, funerals and memorials). A resource may span several unrelated themes, but it cannot be classified under both a theme and one of its subthemes.",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "theme" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.custom(validateNoAncestorDescendantPairs),
  ],
});

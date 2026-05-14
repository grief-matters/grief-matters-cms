import { defineArrayMember, defineField } from "sanity";
import type { CustomValidator } from "sanity";

type TopicRef = { _ref: string };

const validateNoAncestorDescendantPairs: CustomValidator<
  TopicRef[] | undefined
> = async (topics, context) => {
  if (!topics || topics.length < 2) {
    return true;
  }

  const ids = topics
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
    `*[_type == "topic" && _id in $ids]{
      _id,
      "label": coalesce(displayTitle, title, _id),
      "parentId": parentTopic._ref,
      "grandparentId": parentTopic->parentTopic._ref
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
  return `Cannot tag both a topic and one of its parent topics. Choose only the most specific topic: ${conflicts.join(
    "; "
  )}.`;
};

export default defineField({
  name: "topics",
  title: "Topics",
  type: "array",
  description:
    "Topics or themes covered by this resource (e.g. anger, self-care, funerals and memorials). A resource may span several unrelated topics, but it cannot be classified under both a topic and one of its subtopics.",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "topic" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.custom(validateNoAncestorDescendantPairs),
  ],
});

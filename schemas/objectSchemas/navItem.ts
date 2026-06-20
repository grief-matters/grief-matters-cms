import { defineArrayMember, defineField, defineType } from "sanity";
import { internetResourceTypes } from "../../shared/internet-resource";
import startCase from "lodash/startCase";
import audienceRoleField from "../fields/audienceRoleField";
import supportedGrieverField from "../fields/supportedGrieverField";

export default defineType({
  name: "navItem",
  type: "object",
  title: "Navigation Item",
  validation: (rule) =>
    rule.custom((value: Record<string, unknown> | undefined) => {
      if (!value) {
        return "At least one field must be completed";
      }
      const hasValue = Object.entries(value).some(([key, val]) => {
        if (key.startsWith("_")) {
          return false;
        }
        if (val === undefined || val === null || val === "") {
          return false;
        }
        if (Array.isArray(val) && val.length === 0) {
          return false;
        }
        return true;
      });
      return hasValue || "At least one field must be completed";
    }),
  preview: {
    select: {
      label: "label",
      entryPoint: "entryPoint.title",
      filters: "filters",
      types: "mediaTypes",
    },
    prepare: ({ label, entryPoint, filters, types }) => ({
      title: label,
      subtitle: `Goes to: '${entryPoint}'${(filters ?? types ?? []).length > 0 ? " with additional filters applied" : ""}`,
    }),
  },
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "The text that a user will see. If you omit the label, the title of the entry point will be used instead",
      validation: (rule) =>
        rule.custom((label, context) => {
          const parent = context.parent as
            | { entryPoint?: { _ref?: string } }
            | undefined;
          if (!parent?.entryPoint?._ref && !label) {
            return "A label is required when no entry point is selected";
          }
          return true;
        }),
    }),
    defineField({
      name: "entryPoint",
      title: "Entry Point",
      description:
        "A core taxonomy for the navigation target i.e. the focus of the page",
      type: "reference",
      to: [
        { type: "lossRelationship" },
        { type: "causeOfDeath" },
        { type: "theme" },
        { type: "demographic" },
        { type: "griefPhase" },
        { type: "griefType" },
        { type: "emotionalState" },
        { type: "contentFunction" },
      ],
    }),
    defineField({
      name: "filters",
      title: "Additional Filters",
      description:
        "Select any additional taxonomies this navigation item should target",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [
            { type: "lossRelationship" },
            { type: "causeOfDeath" },
            { type: "theme" },
            { type: "demographic" },
            { type: "griefPhase" },
            { type: "griefType" },
            { type: "emotionalState" },
            { type: "contentFunction" },
          ],
        }),
      ],
      validation: (rule) => [
        rule.unique(),
        rule.custom<Array<{ _ref?: string; _key?: string }>>(
          async (filters, context) => {
            const parent = context.parent as
              | { entryPoint?: { _ref?: string } }
              | undefined;

            const entryRef = parent?.entryPoint?._ref;
            if (!entryRef || !filters?.length) {
              return true;
            }

            const refIds = filters
              .map((f) => f._ref)
              .filter((id): id is string => Boolean(id));
            if (!refIds.length) {
              return true;
            }

            const client = context.getClient({ apiVersion: "2024-01-01" });
            const [entryType, filterDocs] = await Promise.all([
              client.fetch<string | null>(`*[_id == $id][0]._type`, {
                id: entryRef,
              }),
              client.fetch<Array<{ _id: string; _type: string }>>(
                `*[_id in $ids]{ _id, _type }`,
                { ids: refIds },
              ),
            ]);

            if (!entryType) {
              return true;
            }

            const conflictIds = new Set(
              filterDocs.filter((d) => d._type === entryType).map((d) => d._id),
            );
            if (!conflictIds.size) {
              return true;
            }

            return {
              message: `Filters cannot include the same type as the entry point ("${entryType}")`,
              paths: filters
                .filter((f) => f._ref && conflictIds.has(f._ref) && f._key)
                .map((f) => [{ _key: f._key! }]),
            };
          },
        ),
      ],
    }),
    defineField({
      name: "mediaTypes",
      title: "Resource Types",
      description: "Specific media types to target. Leave empty for all types",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          ...internetResourceTypes.map((resourceType) => ({
            value: resourceType,
            title: startCase(resourceType),
          })),
        ],
      },
    }),
    defineField({
      ...audienceRoleField,
      description:
        "Filter resources by specific audience target: a bereaved person seeking help for themselves, a supporter helping someone else who is grieving, or a professional working with bereaved clients. Leave unchecked to show all resources",
      group: undefined,
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((roles?: string[]) => {
            if (!roles?.length) {
              return true;
            }

            const hasBereaved = roles.includes("bereaved");
            const hasOther =
              roles.includes("supporter") || roles.includes("professional");

            if (hasBereaved && hasOther) {
              return "'Bereaved' cannot be combined with 'Supporter' or 'Professional'";
            }

            return true;
          }),
    }),
    defineField({
      ...supportedGrieverField,
      group: undefined,
    }),
  ],
});

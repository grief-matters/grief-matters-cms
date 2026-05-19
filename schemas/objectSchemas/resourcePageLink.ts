import { defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { startCase } from "lodash";

export default defineType({
  name: "resourcePageLink",
  type: "object",
  preview: {
    select: {
      label: "label",
    },
    prepare: ({ label }) => ({
      title: "Resources Page Link",
      subtitle: `${label}`,
    }),
  },
  fieldsets: [
    {
      name: "filters",
      title: "Resource Page Filters",
      description: `The following options allow you to link to any kind of resource page. You must select at least one kind of filter. Any options that are left empty will return everything e.g. if you do not select a "topic" then resources under ALL topics will be rendered`,
    },
  ],
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "The text that a user will see",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    // defineField({
    //   name: "topic",
    //   title: "Topic",
    //   description:
    //     "The topic of resources that will be shown on the linked page",
    //   type: "reference",
    //   to: [{ type: "topic" }],
    //   options: {
    //     disableNew: true,
    //   },
    //   fieldset: "filters",
    // }),
    defineField({
      name: "causeOfDeath",
      title: "Cause of Death",
      description:
        "The cause of death of resources that will be shown on the linked page",
      type: "reference",
      to: [{ type: "causeOfDeath" }],
      options: {
        disableNew: true,
      },
      fieldset: "filters",
    }),
    defineField({
      name: "lossRelationship",
      title: "Loss Relationship",
      description:
        "The loss relationship of resources that will be shown on the linked page",
      type: "reference",
      to: [{ type: "lossRelationship" }],
      options: {
        disableNew: true,
      },
      fieldset: "filters",
    }),
    defineField({
      name: "type",
      title: "Resource Types",
      description:
        "The type of resources that will be pre-filtered on the linked page",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          ...INTERNET_RESOURCE_TYPES.map((resourceType) => ({
            value: resourceType,
            title: startCase(resourceType),
          })),
          { value: "crisisResource", title: "Crisis Resource" },
          // {
          //   value: "website",
          //   title: "Website",
          // },
        ],
      },
      fieldset: "filters",
    }),
    // defineField({
    //   name: "audience",
    //   title: "Audience",
    //   description: "The specific audience that resources shown will apply to",
    //   type: "reference",
    //   to: [{ type: "audience" }],
    //   options: {
    //     disableNew: true,
    //   },
    //   fieldset: "filters",
    // }),
  ],
  validation: (Rule) =>
    Rule.custom((fields) => {
      if (typeof fields === "undefined") {
        return true;
      }

      const hasLinkedContent =
        typeof fields?.topic !== "undefined" ||
        typeof fields?.causeOfDeath !== "undefined" ||
        typeof fields?.lossRelationship !== "undefined" ||
        typeof fields?.type !== "undefined" ||
        typeof fields?.audience !== "undefined";

      return hasLinkedContent
        ? true
        : "You must link to at least one of: topic, cause of death, loss relationship, resource type, or audience";
    }),
});

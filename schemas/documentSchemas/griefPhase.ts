import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";
import { slugField, tagSearchAliasesField } from "../fields";

export default defineType({
  name: "griefPhase",
  title: "Clinical Grief Phase",
  icon: ClockIcon,
  type: "document",
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      title: "Description",
      name: "description",
      description:
        "When does this phase apply? Cite the framework (e.g. Stroebe & Schut, Neimeyer, Shear) if useful.",
      type: "text",
    }),
    tagSearchAliasesField,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

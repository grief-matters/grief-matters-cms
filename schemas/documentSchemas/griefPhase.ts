import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";

export default defineType({
  name: "griefPhase",
  title: "Grief Phase",
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
      validation: (rule) => [
        rule.required(),
        rule.max(255).warning("This description is a bit long"),
      ],
    }),
    tagSearchAliasesField,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

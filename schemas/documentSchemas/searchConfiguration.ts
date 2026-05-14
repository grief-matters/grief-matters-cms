import { defineArrayMember, defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

export default defineType({
  name: "searchConfiguration",
  title: "Search Configuration",
  type: "document",
  icon: SearchIcon,
  description:
    "Site-wide search behaviour: linguistic stop words and grief-domain noise words. Synonyms are declared on each classification tag's Search Aliases field.",
  fields: [
    defineField({
      title: "Stop Words",
      name: "stopWords",
      type: "array",
      description:
        'Common linguistic stop words to ignore during search (e.g. "the", "and", "of").',
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      title: "Domain Noise Words",
      name: "domainNoiseWords",
      type: "array",
      description:
        'Grief-specific words that appear in almost every resource and add no discriminative value (e.g. "died", "grief", "loss", "loved one").',
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Search Configuration" }),
  },
});

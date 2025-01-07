import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import {
  categoriesField,
  hasSpanishVersionField,
  populationsField,
  simpleDescriptionField,
  urlField,
} from "../fields";

export default defineType({
  name: "website",
  title: "Website",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      title: "Website Name",
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    simpleDescriptionField,
    hasSpanishVersionField,
    defineField({
      name: "directlyQuoted",
      title: "Description quoted from website.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      ...urlField,
      validation: (Rule) => [
        Rule.custom((resourceUrl) => {
          const pattern = new RegExp("http[s]*://[^/]+(/.+)");
          if (typeof resourceUrl === "undefined") {
            return true;
          } else if (pattern.test(resourceUrl)) {
            return "Based on the URL entered, this is more likely to be a resource than a website.";
          } else {
            return true;
          }
        }).warning(),
        Rule.required(),
      ],
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "image",
    }),
    categoriesField,
    populationsField,
  ],
});

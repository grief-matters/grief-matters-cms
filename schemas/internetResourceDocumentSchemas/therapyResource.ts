import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { hasSpanishVersionField, supportFormatField } from "../fields";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "therapyResource",
  title: "Therapy Resource",
  icon: UsersIcon,
  isUrlRequired: true,
});

const therapyResourceSchema = defineType({
  ...base,
  fields: [
    ...base.fields,
    supportFormatField,
    defineField({
      title: "Budget Friendly Option",
      name: "budgetFriendly",
      type: "boolean",
      description: "Is this resource suitable for budget conscious users.",
      initialValue: false,
    }),
    hasSpanishVersionField,
  ],
});

export default therapyResourceSchema;

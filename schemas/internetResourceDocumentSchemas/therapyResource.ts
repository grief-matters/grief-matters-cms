import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import supportFormatField from "../fields/supportFormatField";

const base = createBaseInternetResourceSchema({
  name: "therapyResource",
  title: "Therapy Resource",
  icon: UsersIcon,
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
  ],
});

export default therapyResourceSchema;

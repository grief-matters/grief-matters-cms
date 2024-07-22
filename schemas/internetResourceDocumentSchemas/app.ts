import { defineField, defineType } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "app",
  title: "App",
  icon: MobileDeviceIcon,
  isUrlRequired: false,
});

// TODO - we'll need to migrate the 'name' field to 'title'
const appSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({
      title: "Apple App Store",
      name: "appleUrl",
      type: "url",
      description: "A link to the Apple App Store listing",
      validation: (Rule) =>
        Rule.custom(function (value) {
          if (typeof value === "undefined") {
            return true;
          }

          const isValid = value.startsWith(`https://apps.apple.com/`);
          return isValid
            ? true
            : `Apple App Store links start with 'https://apps.apple.com/'`;
        }),
    }),
    defineField({
      title: "Play Store",
      name: "playStoreUrl",
      type: "url",
      description: "A link to the Google Play Store listing",
      validation: (Rule) =>
        Rule.custom(function (value) {
          if (typeof value === "undefined") {
            return true;
          }

          const isValid = value.startsWith(
            `https://play.google.com/store/apps/`
          );
          return isValid
            ? true
            : `Google Play Store links start with 'https://play.google.com/store/apps/'`;
        }),
    }),
  ],
  validation: (rule) =>
    rule.custom((fields) => {
      if (typeof fields === "undefined") {
        return true;
      }

      const hasAtLeastOneUrl =
        typeof fields?.resourceUrl !== "undefined" ||
        typeof fields?.appleUrl !== "undefined" ||
        typeof fields?.playStoreUrl !== "undefined";

      return hasAtLeastOneUrl
        ? true
        : `You must specify either a "URL", "Play Store" or "Apple App Store" link`;
    }),
});

export default appSchema;

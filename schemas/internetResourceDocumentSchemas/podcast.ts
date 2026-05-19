import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "podcast",
  title: "Podcast",
  icon: PlayIcon,
  isUrlRequired: false,
});

// TODO - migrate 'name' to 'title'
const podcastSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({
      type: "url",
      name: "spotifyUrl",
      description: "The Spotify URL for the podcast",
      title: "Spotify",
    }),
    defineField({
      type: "url",
      name: "appleUrl",
      description: "The Apple Podcasts URL for the podcast",
      title: "Apple",
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
        typeof fields?.spotifyUrl !== "undefined";

      return hasAtLeastOneUrl
        ? true
        : `You must specify either a website, "Spotify" or "Apple Podcasts" link`;
    }),
});

export default podcastSchema;

import { PlayIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "podcastEpisode",
  title: "Podcast Episode",
  icon: PlayIcon,
  isUrlRequired: true,
});

const podcastEpSchema = defineType({
  ...base,
  fields: [
    ...base.fields,
    defineField({
      title: "Podcast",
      name: "parentPodcast",
      type: "reference",
      to: [{ type: "podcast" }],
    }),
  ],
});

export default podcastEpSchema;

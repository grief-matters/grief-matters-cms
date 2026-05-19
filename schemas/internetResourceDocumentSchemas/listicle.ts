import { OlistIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "listicle",
  title: "Listicle",
  icon: OlistIcon,
});

const listicleSchema = defineType({
  ...base,
  fields: [
    ...base.fields,
    defineField({
      name: "listOf",
      title: "List Of",
      type: "string",
      group: "attributes",
      options: {
        list: [
          { value: "app", title: "App" },
          { value: "article", title: "Article" },
          { value: "blog", title: "Blog" },
          { value: "book", title: "Book" },
          { value: "community", title: "Community" },
          { value: "course", title: "Course" },
          { value: "crisisResource", title: "Crisis Resource" },
          { value: "forum", title: "Forum" },
          { value: "peerSupport", title: "Peer Support" },
          { value: "podcast", title: "Podcast" },
          { value: "story", title: "Story" },
          { value: "supportGroup", title: "Support Group" },
          { value: "therapyResource", title: "Therapy Resource" },
          { value: "video", title: "Video" },
          { value: "website", title: "Website" },
          { value: "mixed", title: "Mixed" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default listicleSchema;

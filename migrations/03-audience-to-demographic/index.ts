import { createIfNotExists, defineMigration } from "sanity/migrate";

import { v4 as uuid } from "uuid";

type SlugValue = { _type: "slug"; current: string };

export default defineMigration({
  title: "Create 'demographic' docs from existing 'audience' docs",
  documentTypes: ["audience"],
  filter: "defined(slug.current)",

  migrate: {
    document(doc) {
      const slug = (doc.slug as SlugValue | undefined)?.current;
      if (!slug) {
        return [];
      }

      const name = doc.name as string | undefined;
      if (!name) {
        return [];
      }

      const newDoc: Record<string, unknown> = {
        _id: uuid(),
        _type: "demographic",
        name,
        slug: doc.slug as SlugValue,
      };

      if (typeof doc.description === "string") {
        newDoc.description = doc.description;
      }
      if (typeof doc.underserved === "boolean") {
        newDoc.underserved = doc.underserved;
      }
      if (doc.imageRef) {
        newDoc.imageRef = doc.imageRef;
      }

      return [
        createIfNotExists(newDoc as Parameters<typeof createIfNotExists>[0]),
      ];
    },
  },
});

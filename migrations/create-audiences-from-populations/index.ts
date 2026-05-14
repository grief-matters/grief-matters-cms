import { createIfNotExists, defineMigration } from "sanity/migrate";

type SlugValue = { _type: "slug"; current: string };

export default defineMigration({
  title: "Create 'audience' docs from existing 'population' docs",
  documentTypes: ["population"],
  filter: "defined(slug.current)",

  migrate: {
    document(doc) {
      const slug = (doc.slug as SlugValue | undefined)?.current;
      if (!slug) {
        return [];
      }

      const name = doc.name as string | undefined;
      if (!name) {
        console.warn(
          `[create-audiences-from-populations] population ${doc._id} has slug "${slug}" but no name — skipping`
        );
        return [];
      }

      const newDoc: Record<string, unknown> = {
        _id: `audience-${slug}`,
        _type: "audience",
        name,
        slug: doc.slug as SlugValue,
      };

      if (typeof doc.description === "string") {
        newDoc.description = doc.description;
      }
      if (typeof doc.underserved === "boolean") {
        newDoc.underserved = doc.underserved;
      }
      if (doc.image && typeof doc.image === "object") {
        newDoc.image = doc.image;
      }

      return [
        createIfNotExists(newDoc as Parameters<typeof createIfNotExists>[0]),
      ];
    },
  },
});

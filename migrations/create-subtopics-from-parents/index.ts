import groq from "groq";
import { at, defineMigration, SanityDocument, set } from "sanity/migrate";

export default defineMigration({
  title: "Create subtopics from parents",
  documentTypes: ["category"],

  migrate: {
    async document(category, context) {
      // we need to fetch categories that reference this cat as a parent
      const childrenQuery = groq`*[_type == 'category' && parent._ref == $parentId]`;

      const childrenDocs = await context.client.fetch(childrenQuery, {
        parentId: category._id,
      });

      // create the patch...
      const subtopics = childrenDocs.map((x: SanityDocument) => ({
        _type: "reference",
        _ref: x._id,
      }));

      return at("subtopics", set(subtopics ?? []));
    },
  },
});

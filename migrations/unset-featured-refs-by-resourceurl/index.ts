import groq from "groq";
import { at, defineMigration, SanityDocument, set } from "sanity/migrate";

// Set the string that will be used by GROQ's 'match' function
const match = `https://www.joincake.com*`;

export default defineMigration({
  title: "Unset 'featured...' refs by 'resourceUrl'",
  documentTypes: ["category"],
  filter: `length(featuredArticles) > 0 || length(featuredStories) > 0`,
  migrate: {
    async document(doc, context) {
      const query = groq`*[defined(resourceUrl) && resourceUrl match "${match}"]`;
      const matchedDocs = await context.client.fetch(query);
      const refsToRemove = new Set(
        matchedDocs.map((doc: SanityDocument) => doc._id)
      );

      const featuredArticles = doc.featuredArticles;
      const featuredArticlesPatch = [];
      if (Array.isArray(featuredArticles)) {
        const newValue = featuredArticles.filter(
          (a) => !refsToRemove.has(a._ref)
        );
        featuredArticlesPatch.push(...newValue);
      }

      const featuredStories = doc.featuredStories;
      const featuredStoriesPatch = [];
      if (Array.isArray(featuredStories)) {
        const newValue = featuredStories.filter(
          (a) => !refsToRemove.has(a._ref)
        );
        featuredStoriesPatch.push(...newValue);
      }

      return [
        at("featuredArticles", set(featuredArticlesPatch)),
        at("featuredStories", set(featuredStoriesPatch)),
      ];
    },
  },
});

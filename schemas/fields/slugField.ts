import { defineField } from "sanity";

export default defineField({
  title: "Slug",
  name: "slug",
  type: "slug",
  options: {
    source: (doc) =>
      (typeof doc?.title === "undefined"
        ? doc.name ?? ""
        : doc.title ?? "") as string,
    slugify: (input) => input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
    isUnique: async (slug, context) => {
      const { document, getClient } = context;
      const client = getClient({
        apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
      });
      const id = document?._id.replace(/^drafts\./, "");
      const params = {
        draft: `drafts.${id}`,
        published: id,
        slug,
      };
      const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
      const result = await client.fetch(query, params);
      return result;
    },
  },
  validation: (Rule) => Rule.required(),
});

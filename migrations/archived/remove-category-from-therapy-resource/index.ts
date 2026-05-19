import { at, defineMigration, set } from "sanity/migrate";

const CATEGORY_ID = "b3f3622d-10da-4518-848c-fa4865490946";

export default defineMigration({
  title: "Remove specific category from therapyResource",
  documentTypes: ["therapyResource"],

  migrate: {
    document(doc) {
      const categories = doc.categories as
        | Array<{ _ref: string; _key: string }>
        | undefined;

      if (!categories) {
        return;
      }

      const hasCategory = categories.some((cat) => cat._ref === CATEGORY_ID);

      if (!hasCategory) {
        return;
      }

      const filtered = categories.filter((cat) => cat._ref !== CATEGORY_ID);

      return at("categories", set(filtered));
    },
  },
});

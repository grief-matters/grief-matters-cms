import { at, defineMigration, set } from "sanity/migrate";

export default defineMigration({
  title: "Append '-old' to every category slug",
  documentTypes: ["category"],
  filter: "defined(slug.current) && !(slug.current match '*-old')",
  migrate: {
    document(doc) {
      const current = (doc.slug as { current?: string } | undefined)?.current;

      if (!current) {
        return;
      }

      return at("slug.current", set(`${current}-old`));
    },
  },
});

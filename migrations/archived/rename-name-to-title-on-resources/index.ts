import { at, defineMigration, set, unset } from "sanity/migrate";

export default defineMigration({
  title: "Rename name to title on website and crisisResource",
  documentTypes: ["website", "crisisResource"],
  filter: "defined(name)",
  migrate: {
    document(doc) {
      const nameValue = doc.name as string;
      return [at("title", set(nameValue)), at("name", unset())];
    },
  },
});

import { at, defineMigration, set } from "sanity/migrate";

const valueMap: Record<string, string> = {
  Virtual: "remote",
  "In person": "in-person",
};

export default defineMigration({
  title: "Migrate format from string to array",
  documentTypes: ["peerSupport", "supportGroup", "forum", "therapyResource"],
  filter: "defined(format)",
  migrate: {
    document(doc) {
      const oldValue = doc.format as string;
      const newValue = valueMap[oldValue];

      if (newValue) {
        return at("format", set([newValue]));
      }
    },
  },
});

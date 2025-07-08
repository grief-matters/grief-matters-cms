import { defineMigration, del } from "sanity/migrate";

// Set the string that will be used by GROQ's 'match' function
const match = `https://www.joincake.com*`;

export default defineMigration({
  title: "Delete resources where 'resourceUrl' matches a specific GROQ match",
  filter: `defined(resourceUrl) && resourceUrl match "${match}"`,
  migrate: {
    document(doc) {
      return del(doc._id);
    },
  },
});

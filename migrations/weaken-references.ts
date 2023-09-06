/**
 * Script needs to be run with sanity exec and --withUserToken flag
 */
import { getCliClient } from "sanity/cli";
import { MapObject } from "../types";

const parentReferenceMap: MapObject = {
  podcastEpisode: "parentPodcast",
  article: "parentBlog",
} as const;

const isDryRun = process.argv.indexOf("--dry-run") !== -1;

// Checks for --type and if it has a value
const typeIndex = process.argv.indexOf("--type");
let typeArg = "";

if (typeIndex > -1) {
  // Retrieve the value after --type
  typeArg = process.argv[typeIndex + 1];
} else {
  console.error("No argument supplied for type!");
  process.exit(1);
}

const client = getCliClient();
weakenReferencesByType(typeArg);

async function weakenReferencesByType(type: any) {
  if (type !== "podcastEpisode") return;

  try {
    let patchTransaction = client.transaction();

    const docs = await client.fetch(`*[_type == "${type}"]`);

    docs.forEach((doc: any) => {
      const referenceField = parentReferenceMap[typeArg];

      if (typeof referenceField === "undefined") {
        throw new Error(
          `Argument of Type: "${typeArg}" has no parent reference field.`
        );
      }

      const referenceFieldKey = `${referenceField}._weak`;

      const patch = client.patch(doc._id).set({ [referenceFieldKey]: true });
      patchTransaction.patch(patch);
    });

    await patchTransaction.commit({ dryRun: isDryRun });
  } catch (e) {
    console.error(e);
  }
}

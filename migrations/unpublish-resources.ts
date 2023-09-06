import { getCliClient } from "sanity/cli";

// Check to see if this is a --dry-run
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
createDrafts(typeArg).then(() => deletePublished(typeArg));

async function createDrafts(type: string) {
  try {
    let createDraftsTransaction = client.transaction();

    const docs = await getInternetResourcesByType(type);

    docs.forEach((doc: any) => {
      createDraftsTransaction.createIfNotExists(getDocumentAsDraft(doc));
    });

    await createDraftsTransaction.commit({ dryRun: isDryRun });
  } catch (e) {
    console.error(e);
  }
}

async function deletePublished(type: any) {
  try {
    let deleteTransaction = client.transaction();

    const docs = await getPublishedInternetResourcesByType(type);

    docs.forEach((doc: any) => {
      deleteTransaction.delete(doc._id);
    });

    await deleteTransaction.commit({ dryRun: isDryRun });
  } catch (e) {
    console.error(e);
  }
}

async function getInternetResourcesByType(type: any) {
  const resources = await client.fetch(`*[_type == "${type}"]`);
  return resources;
}

async function getPublishedInternetResourcesByType(type: any) {
  const resources = await client.fetch(
    `*[_type == "${type}" && !(_id in path("drafts.**"))]`
  );
  return resources;
}

function getDocumentAsDraft(doc: any) {
  return doc._id.startsWith("drafts.")
    ? doc
    : { ...doc, _id: `drafts.${doc._id}` };
}

/**
 * Run this script from within project folder e.g: `sanity exec --with-user-token migrations/script.ts`
 *
 * This will migrate documents in batches of 100 and continue patching until no more documents are
 * returned from the query.
 *
 * This script can safely be run, even if documents are being concurrently modified by others.
 * If a document gets modified in the time between fetch => submit patch, this script will fail,
 * but can safely be re-run multiple times until it eventually runs out of documents to migrate.
 *
 * A few things to note:
 * - This script will exit if any of the mutations fail due to a revision mismatch (which means the
 *   document was edited between fetch => update)
 * - The query must eventually return an empty set, or else this script will continue indefinitely
 *
 * Fetching documents that matches the precondition for the migration.
 * NOTE: This query should eventually return an empty set of documents to mark the migration
 * as complete
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const fetchDocuments = () =>
  client.fetch(
    `*[_type == 'article' && !defined(hasSpanishVersion)][0...100] {_id, _rev}`
  );

const buildPatches = (docs: any) =>
  docs.map((doc: any) => ({
    id: doc._id,
    patch: {
      set: {
        hasSpanishVersion: false,
      },
      // this will cause the transaction to fail if the documents has been
      // modified since it was fetched.
      ifRevisionID: doc._rev,
    },
  }));

const createTransaction = (patches: any) =>
  patches.reduce(
    (tx: any, patch: any) => tx.patch(patch.id, patch.patch),
    client.transaction()
  );

const commitTransaction = (tx: any) => tx.commit();

const migrateNextBatch = async (): Promise<any> => {
  const documents = await fetchDocuments();
  const patches = buildPatches(documents);
  if (patches.length === 0) {
    console.log("No more documents to migrate!");
    return null;
  }
  console.log(
    `Migrating batch:\n %s`,
    patches
      .map((patch: any) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
      .join("\n")
  );
  const transaction = createTransaction(patches);
  await commitTransaction(transaction);
  return migrateNextBatch();
};

migrateNextBatch().catch((err: any) => {
  console.error(err);
  process.exit(1);
});

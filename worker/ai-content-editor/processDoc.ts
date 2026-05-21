import Anthropic from "@anthropic-ai/sdk";
import { SanityClient, SanityDocument } from "@sanity/client";
import { applyAuditPatch, auditDocument } from "./auditDocument";
import { checkRobotsTxt, fetchContent, type FetchResult } from "./fetchers";
import { createNonScrapablePatch } from "./patches";
import type { RefDocs } from "./types";

export type AuditServices = {
  env: Env;
  llm: Anthropic;
  sanity: SanityClient;
  refDocs: RefDocs;
};

export type DocOutcome =
  | { type: "skipped_no_url" }
  | { type: "non_scrapable_robots" }
  | {
      type: "non_scrapable_fetch";
      reason: Extract<FetchResult, { ok: false }>["reason"];
      status?: number;
    }
  | { type: "no_op" }
  | { type: "draft_created" };

export async function processDoc(
  services: AuditServices,
  doc: SanityDocument
): Promise<DocOutcome> {
  const url = doc.resourceUrl as string | undefined;
  if (!url) {
    return { type: "skipped_no_url" };
  }

  if (!(await checkRobotsTxt(url))) {
    await services.sanity
      .patch(doc._id)
      .set(createNonScrapablePatch())
      .commit();
    return { type: "non_scrapable_robots" };
  }

  const fetchResult = await fetchContent(services.env, url);
  if (!fetchResult.ok) {
    await services.sanity
      .patch(doc._id)
      .set(createNonScrapablePatch())
      .commit();
    return {
      type: "non_scrapable_fetch",
      reason: fetchResult.reason,
      ...(fetchResult.reason === "http" ? { status: fetchResult.status } : {}),
    };
  }

  const patch = await auditDocument(
    services.llm,
    doc,
    fetchResult.content,
    services.refDocs
  );

  if (Object.keys(patch).length === 0) {
    if (doc.title) {
      await services.sanity.patch(doc._id).set({ title: doc.title }).commit();
    }
    return { type: "no_op" };
  }

  const draftDoc = applyAuditPatch(doc, patch);
  draftDoc._id = `drafts.${doc._id}`;
  await services.sanity.createIfNotExists(draftDoc);
  return { type: "draft_created" };
}

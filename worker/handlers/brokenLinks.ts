import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import type {
  BrokenLinkEntry,
  BrokenLinksReport,
} from "../../shared/types/broken-links";
import {
  fetchPublishedResources,
  type SanityResourceDocument,
} from "../utils/sanity-client";
import { checkUrls, type UrlCheckResult } from "../utils/url-checker";

const KV_LATEST_KEY = "latest-report";
const KV_PREVIOUS_KEY = "previous-report";

interface DocumentUrl {
  documentId: string;
  documentType: string;
  documentTitle: string;
  url: string;
  urlField: string;
}

function extractUrls(doc: SanityResourceDocument): DocumentUrl[] {
  const urls: DocumentUrl[] = [];
  const title = doc.title || doc.name || "Untitled";

  const urlFields: Array<{
    field: keyof SanityResourceDocument;
    name: string;
  }> = [
    { field: "resourceUrl", name: "resourceUrl" },
    { field: "appleUrl", name: "appleUrl" },
    { field: "playStoreUrl", name: "playStoreUrl" },
    { field: "spotifyUrl", name: "spotifyUrl" },
  ];

  for (const { field, name } of urlFields) {
    const value = doc[field];
    if (typeof value === "string" && value.length > 0) {
      urls.push({
        documentId: doc._id,
        documentType: doc._type,
        documentTitle: title,
        url: value,
        urlField: name,
      });
    }
  }

  return urls;
}

function buildReport(
  documentUrls: DocumentUrl[],
  checkResults: Map<string, UrlCheckResult>,
  previousEntries: Map<string, BrokenLinkEntry>,
  startTime: number,
  totalDocuments: number
): BrokenLinksReport {
  const now = new Date().toISOString();
  const entries: BrokenLinkEntry[] = [];

  for (const docUrl of documentUrls) {
    const result = checkResults.get(docUrl.url);
    if (!result || result.status === "ok" || result.status === "skipped") {
      continue;
    }

    // Look up previous entry by document+field combo for consecutive failure tracking
    const prevKey = `${docUrl.documentId}:${docUrl.urlField}`;
    const prev = previousEntries.get(prevKey);

    entries.push({
      documentId: docUrl.documentId,
      documentType: docUrl.documentType,
      documentTitle: docUrl.documentTitle,
      url: docUrl.url,
      urlField: docUrl.urlField,
      httpStatus: result.httpStatus,
      error: result.error,
      status: result.status,
      consecutiveFailures: (prev?.consecutiveFailures ?? 0) + 1,
      firstFailedAt: prev?.firstFailedAt ?? now,
      lastCheckedAt: now,
    });
  }

  return {
    lastScanAt: now,
    totalChecked: checkResults.size,
    totalDocuments,
    scanDurationMs: Date.now() - startTime,
    entries,
  };
}

export async function handleScheduledBrokenLinkCheck(
  _event: ScheduledEvent,
  env: Env,
  _ctx: ExecutionContext
): Promise<void> {
  const startTime = Date.now();

  try {
    if (!env.WGM_BROKEN_LINKS) {
      console.error("WGM_BROKEN_LINKS namespace is not configured");
      return;
    }

    const documents = await fetchPublishedResources(env);
    const allDocumentUrls = documents.flatMap(extractUrls);
    const allUrls = allDocumentUrls.map((d) => d.url);

    // Load previous report for consecutive failure tracking
    const previousReport = await env.WGM_BROKEN_LINKS.get<BrokenLinksReport>(
      KV_LATEST_KEY,
      "json"
    );

    const previousEntries = new Map<string, BrokenLinkEntry>();
    if (previousReport) {
      for (const entry of previousReport.entries) {
        previousEntries.set(`${entry.documentId}:${entry.urlField}`, entry);
      }
    }

    const checkResults = await checkUrls(allUrls);
    const report = buildReport(
      allDocumentUrls,
      checkResults,
      previousEntries,
      startTime,
      documents.length
    );

    // Rotate old report
    if (previousReport) {
      await env.WGM_BROKEN_LINKS.put(
        KV_PREVIOUS_KEY,
        JSON.stringify(previousReport)
      );
    }

    await env.WGM_BROKEN_LINKS.put(KV_LATEST_KEY, JSON.stringify(report));

    console.log(
      `Broken link scan complete: ${report.entries.length} issues found out of ${report.totalChecked} URLs checked in ${report.scanDurationMs}ms`
    );
  } catch (err) {
    console.error("Broken link scan failed:", err);
    // Don't overwrite existing report on failure
  }
}

const EMPTY_REPORT: BrokenLinksReport = {
  lastScanAt: "",
  totalChecked: 0,
  totalDocuments: 0,
  scanDurationMs: 0,
  entries: [],
};

export const handleGetBrokenLinks: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  if (!env.WGM_BROKEN_LINKS) {
    return Response.json(EMPTY_REPORT);
  }

  const report = await env.WGM_BROKEN_LINKS.get<BrokenLinksReport>(
    KV_LATEST_KEY,
    "json"
  );

  return Response.json(report ?? EMPTY_REPORT);
};

import robotsParser from "robots-parser";

import type { SanityDocument } from "sanity";

export type FetchResult =
  | { ok: true; content: string }
  | { ok: false; reason: "http"; status: number }
  | { ok: false; reason: "network" | "timeout" | "empty" };

type DocAuditSkipActionReason = "no_url" | "fetch_content" | "audit_fail";
type DocAuditDisableActionReason = "robots" | "http_client_error";

type DocAuditSkipAction = {
  id: string;
  action: "skip";
  reason: DocAuditSkipActionReason;
  detail?: string;
};
type DocAuditDisableAction = {
  id: string;
  action: "disable";
  reason: DocAuditDisableActionReason;
  detail?: string;
};
type DocAuditReviewAction = { id: string; action: "review"; content: string };

type DocAuditAction =
  | DocAuditSkipAction
  | DocAuditDisableAction
  | DocAuditReviewAction;

const userAgent = "WhyGriefMattersBot/1.0 (+https://whygriefmatters.org)";
const robotsTimeoutMs = 5000;
const jinaTimeoutMs = 30000;

// Start with an arbitrary number and tune - we're saying mark less than 250 characters is probably not the resource
const minContentLength = 250;

export async function getAuditActionForDoc(
  env: Env,
  doc: SanityDocument,
): Promise<DocAuditAction> {
  const url = doc.resourceUrl as string | undefined;
  if (!url || url?.trim().length === 0) {
    return { id: doc._id, action: "skip", reason: "no_url" };
  }

  const doesAllowBots = await allowsBots(url);
  if (!doesAllowBots) {
    return { id: doc._id, action: "disable", reason: "robots" };
  }

  const fetchResult = await fetchPageContent(env, url);
  if (!fetchResult.ok) {
    if (
      fetchResult.reason === "http" &&
      fetchResult.status >= 400 &&
      fetchResult.status < 500
    ) {
      return {
        id: doc._id,
        action: "disable",
        reason: "http_client_error",
        detail: `${fetchResult.status}`,
      };
    }

    return {
      id: doc._id,
      action: "skip",
      reason: "fetch_content",
      detail:
        fetchResult.reason +
        (fetchResult.reason === "http" ? `: ${fetchResult.status}` : ""),
    };
  }

  return { id: doc._id, action: "review", content: fetchResult.content };
}

/**
 * Fetches the content of a URL - currently uses Jina and returns Markdown
 *
 * @param env
 * @param resourceUrl
 * @returns
 */
async function fetchPageContent(
  env: Env,
  resourceUrl: string,
): Promise<FetchResult> {
  const jinaUrl = `https://r.jina.ai/${encodeURIComponent(resourceUrl)}`;

  let response: Response;

  let content: string = "";

  try {
    response = await fetch(jinaUrl, {
      headers: {
        Authorization: `Bearer ${env.JINA_API_KEY}`,
        "User-Agent": userAgent,
        "X-User-Agent": userAgent,
      },
      signal: AbortSignal.timeout(jinaTimeoutMs),
    });

    if (!response.ok) {
      return { ok: false, reason: "http", status: response.status };
    }

    content = await response.text();
  } catch (error) {
    if (
      error instanceof Error &&
      (error?.name === "TimeoutError" || error?.name === "AbortError")
    ) {
      return { ok: false, reason: "timeout" };
    }

    return { ok: false, reason: "network" };
  }

  if (content.trim().length < minContentLength) {
    return { ok: false, reason: "empty" };
  }

  return { ok: true, content };
}

/**
 * Polite robots.txt check. Returns a promise that resolves to a boolean
 *
 * @param resourceUrl
 * @returns
 */
export async function allowsBots(resourceUrl: string): Promise<boolean> {
  let robotsUrl: string;
  let body: string;
  try {
    robotsUrl = new URL("/robots.txt", resourceUrl).toString();

    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(robotsTimeoutMs),
    });

    // todo: not completely polite - treating 5xx as ok

    if (response.status === 404) {
      return true;
    }
    if (!response.ok) {
      return true;
    }

    body = await response.text();
  } catch {
    return true;
  }

  const robots = robotsParser(robotsUrl, body);
  return robots.isAllowed(resourceUrl, userAgent) ?? true;
}

export function generateAuditActionLogMessage(auditAction: DocAuditAction) {
  return JSON.stringify(auditAction);
}

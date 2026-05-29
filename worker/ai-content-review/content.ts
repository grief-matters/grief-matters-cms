import robotsParser from "robots-parser";
import type { SanityDocument } from "sanity";

export type DocumentContentResult =
  | { ok: false; kind: "missing_url" }
  | { ok: false; kind: "blocked_by_robots" }
  | { ok: false; kind: "http_client_error"; httpCode: number }
  | { ok: false; kind: "temporary_failure"; detail: string }
  | { ok: false; kind: "content_error"; detail: string }
  | { ok: true; content: string };

type FetchContentResult =
  | { ok: false }
  | { ok: true; content: string; truncated: boolean };

type ContentFetcherProviderResult =
  | { ok: false; kind: "timeout" }
  | { ok: false; kind: "network" }
  | { ok: false; kind: "http"; httpCode: number }
  | { ok: true; content: string };

type ContentValidationResult =
  | { ok: false; reason: string }
  | { ok: true; content: string; truncated: boolean };

export type DocumentAction =
  | { action: "skip" | "disable"; detail: string }
  | { action: "review"; content: string };

const userAgent = "WhyGriefMattersBot/1.0 (+https://whygriefmatters.org)";
// robots.txt User-agent directives match by token, not full UA string.
const botToken = "WhyGriefMattersBot";
const robotsTimeoutMs = 5000;
const jinaTimeoutMs = 30000;

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
  return robots.isAllowed(resourceUrl, botToken) ?? true;
}

/**
 * Calls Jina's reader API to extract a URL's content as markdown. Distinguishes
 * timeout, network, and HTTP failures so the caller can decide retry strategy.
 *
 * @param env
 * @param resourceUrl
 * @returns
 */
async function fetchJinaMarkdown(
  env: Env,
  resourceUrl: string,
): Promise<ContentFetcherProviderResult> {
  const jinaUrl = `https://r.jina.ai/${encodeURIComponent(resourceUrl)}`;

  try {
    const response = await fetch(jinaUrl, {
      headers: {
        Authorization: `Bearer ${env.JINA_API_KEY}`,
        "User-Agent": userAgent,
        "X-User-Agent": userAgent,
      },
      signal: AbortSignal.timeout(jinaTimeoutMs),
    });

    if (!response.ok) {
      return {
        ok: false,
        kind: "http",
        httpCode: response.status,
      };
    }

    return {
      ok: true,
      content: await response.text(),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return { ok: false, kind: "timeout" };
    }

    return { ok: false, kind: "network" };
  }
}

/**
 * Trims fetched content and enforces character bounds. Rejects content shorter
 * than `minChar`; truncates (and flags) content longer than `maxChar`.
 *
 * @param content
 * @param minChar
 * @param maxChar
 * @returns
 */
function normalizeFetchedContent(
  content: string,
  minChar: number,
  maxChar: number,
): ContentValidationResult {
  const trimmed = content.trim();

  if (trimmed.length < minChar) {
    return {
      ok: false,
      reason: `content less than specified min chars '${minChar}'`,
    };
  }

  if (trimmed.length > maxChar) {
    return { ok: true, content: trimmed.slice(0, maxChar), truncated: true };
  }

  return {
    ok: true,
    content: trimmed,
    truncated: false,
  };
}

/**
 * Fetches the content of a URL - currently uses Jina and returns Markdown
 *
 * @param env
 * @param resourceUrl
 * @returns
 */
async function fetchContentForUrl(
  env: Env,
  resourceUrl: string,
): Promise<FetchContentResult> {
  const contentFetcherResult = await fetchJinaMarkdown(env, resourceUrl);
  if (!contentFetcherResult.ok) {
    return { ok: false };
  }

  const normalizedContent = normalizeFetchedContent(
    contentFetcherResult.content,
    env.AI_CONTENT_REVIEW_CONTENT_MIN_CHARS,
    env.AI_CONTENT_REVIEW_CONTENT_MAX_CHARS,
  );

  if (!normalizedContent.ok) {
    return { ok: false };
  }

  return {
    ok: true,
    content: normalizedContent.content,
    truncated: normalizedContent.truncated,
  };
}

/**
 * Top-level content fetch for a Sanity doc: validates the URL, respects
 * robots.txt, then fetches and normalizes the page content. Returns a tagged
 * result so the caller can map outcomes to follow-up actions.
 *
 * @param env
 * @param doc
 * @returns
 */
export async function getDocumentContent(
  env: Env,
  doc: SanityDocument,
): Promise<DocumentContentResult> {
  const url = doc.resourceUrl;
  if (typeof url !== "string" || url.trim().length === 0) {
    return { ok: false, kind: "missing_url" };
  }

  const doesAllowBots = await allowsBots(url);
  if (!doesAllowBots) {
    // log
    return { ok: false, kind: "blocked_by_robots" };
  }

  const fetchResult = await fetchContentForUrl(env, url);
  if (!fetchResult.ok) {
    return { ok: false, kind: "content_error", detail: "" };
  }

  return { ok: true, content: fetchResult.content };
}

/**
 * Maps a content fetch outcome to a document action: `disable` for permanent
 * problems (missing URL, robots block), `skip` for transient ones (HTTP/network
 * errors), and `review` when content was fetched successfully.
 *
 * @param contentResult
 * @returns
 */
export function getDocumentActionFromContentResult(
  contentResult: DocumentContentResult,
): DocumentAction {
  if (!contentResult.ok) {
    switch (contentResult.kind) {
      case "blocked_by_robots":
      case "missing_url":
        return { action: "disable", detail: contentResult.kind };
      case "http_client_error":
        return {
          action: "skip",
          detail: `${contentResult.kind}:${contentResult.httpCode}`,
        };
      case "content_error":
      case "temporary_failure":
      default:
        return {
          action: "skip",
          detail: contentResult.kind,
        };
    }
  }

  return { action: "review", content: contentResult.content };
}

import type { LinkCheckStatus } from "../../shared/types/broken-links";

const USER_AGENT =
  "WhyGriefMattersBot/1.0 (+https://whygriefmatters.org; link-checker)";
const REQUEST_TIMEOUT_MS = 15_000;
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 1_000;

export interface UrlCheckResult {
  url: string;
  httpStatus: number | null;
  error: string;
  status: LinkCheckStatus | "ok" | "skipped";
}

function classifyResponse(
  status: number,
): LinkCheckStatus | "ok" | "skipped" {
  if (status === 429) return "skipped";
  if (status === 404 || status === 410) return "broken";
  if (status >= 500 || status === 403) return "warning";
  if (status >= 200 && status < 400) return "ok";
  return "warning";
}

async function checkSingleUrl(url: string): Promise<UrlCheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Try HEAD first
    let response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
    });

    // Fallback to GET on 405 Method Not Allowed
    if (response.status === 405) {
      response = await fetch(url, {
        method: "GET",
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
        redirect: "follow",
      });
    }

    const status = classifyResponse(response.status);
    return {
      url,
      httpStatus: response.status,
      error: status === "ok" || status === "skipped" ? "" : `HTTP ${response.status}`,
      status,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("abort") || message.includes("timed out")) {
      return { url, httpStatus: null, error: "Request timed out", status: "timeout" };
    }

    if (
      message.includes("DNS") ||
      message.includes("ENOTFOUND") ||
      message.includes("getaddrinfo")
    ) {
      return { url, httpStatus: null, error: message, status: "dns_error" };
    }

    return { url, httpStatus: null, error: message, status: "dns_error" };
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkUrls(
  urls: string[],
): Promise<Map<string, UrlCheckResult>> {
  const unique = [...new Set(urls)];
  const results = new Map<string, UrlCheckResult>();

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(checkSingleUrl));

    for (const result of batchResults) {
      results.set(result.url, result);
    }

    // Delay between batches (skip after last batch)
    if (i + BATCH_SIZE < unique.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return results;
}

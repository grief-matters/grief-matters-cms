import robotsParser from "robots-parser";

export const USER_AGENT =
  "WhyGriefMattersBot/1.0 (+https://whygriefmatters.org)";

const ROBOTS_TIMEOUT_MS = 5000;
const JINA_TIMEOUT_MS = 30_000;
const MIN_CONTENT_LENGTH = 100;

export type FetchResult =
  | { ok: true; content: string }
  | { ok: false; reason: "http"; status: number }
  | { ok: false; reason: "network" | "timeout" | "empty" };

export async function checkRobotsTxt(resourceUrl: string): Promise<boolean> {
  const robotsUrl = new URL("/robots.txt", resourceUrl).toString();

  let body: string;
  try {
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(ROBOTS_TIMEOUT_MS),
    });

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
  return robots.isAllowed(resourceUrl, USER_AGENT) ?? true;
}

export async function fetchContent(
  env: Env,
  resourceUrl: string
): Promise<FetchResult> {
  const jinaUrl = `https://r.jina.ai/${encodeURIComponent(resourceUrl)}`;

  let response: Response;
  try {
    response = await fetch(jinaUrl, {
      headers: {
        Authorization: `Bearer ${env.JINA_API_KEY}`,
        "User-Agent": USER_AGENT,
        "X-User-Agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(JINA_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "network" };
  }

  if (!response.ok) {
    return { ok: false, reason: "http", status: response.status };
  }

  const content = await response.text();
  if (content.trim().length < MIN_CONTENT_LENGTH) {
    return { ok: false, reason: "empty" };
  }

  return { ok: true, content };
}

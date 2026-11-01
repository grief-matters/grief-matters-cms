import { generateSanityDocKey } from "../sanity/utils";
import { logger } from "../utils/logger";
import type { AiReviewUsage } from "./ai-review";

export type ReviewOutcome =
  | "ai_success"
  | "ai_failed"
  | "skipped"
  | "disabled"
  | "content_fetch_failed";

/**
 * Outcome of the quality-scoring branch that runs inside a successful review of
 * a scorable, not-yet-scored doc. `not_scorable`/`already_scored` mean the
 * branch never fired; `scored`/`score_na` are AI outcomes; `score_failed` is a
 * soft failure (the review draft still commits without a score).
 */
export type ScoreOutcome =
  | "scored"
  | "score_na"
  | "score_failed"
  | "already_scored"
  | "not_scorable";

export type ReportLine = {
  auditEventId: string;
  _id: string;
  docType: string;
  outcome: ReviewOutcome;
  success: boolean;
  fieldCount: number | null;
  latencyMs?: number;
  tokens?: AiReviewUsage;
  failureReason?: string;
  scoreOutcome?: ScoreOutcome;
  qualityScore?: number;
  scoreTokens?: AiReviewUsage;
};

const TTL_SECONDS = 90 * 24 * 60 * 60;

export type CycleSummary = {
  outcomes: Partial<Record<ReviewOutcome, number>>;
  scoreOutcomes: Partial<Record<ScoreOutcome, number>>;
};

function countBy<K extends string>(values: Array<K | undefined>) {
  const counts: Partial<Record<K, number>> = {};
  for (const value of values) {
    if (value !== undefined) {
      counts[value] = (counts[value] ?? 0) + 1;
    }
  }
  return counts;
}

export class ReviewReportSink {
  readonly cycleId = generateSanityDocKey();
  readonly startedAt = new Date().toISOString();
  private lines: ReportLine[] = [];
  private stamps = new Map<string, string>();

  /**
   * Returns this cycle's audit stamp for `docId`, minting one on first request.
   * Same id always maps to the same stamp. When a mutation is produced for this doc,
   * it will carry this ID, so successful events in the report can be joined back to the Sanity record.
   * Failure events live only in the report.
   */
  stampFor(docId: string): string {
    let stamp = this.stamps.get(docId);
    if (!stamp) {
      stamp = generateSanityDocKey();
      this.stamps.set(docId, stamp);
    }
    return stamp;
  }

  record(line: ReportLine): void {
    this.lines.push(line);
  }

  summarize(): CycleSummary {
    return {
      outcomes: countBy(this.lines.map((l) => l.outcome)),
      scoreOutcomes: countBy(this.lines.map((l) => l.scoreOutcome)),
    };
  }

  /**
   * Logs the cycle summary, escalating to an error when the cycle did no
   * useful work (no review produced a mutation) or most docs failed to fetch —
   * the signature of a provider outage that would otherwise only show in KV.
   */
  private logSummary(summary: CycleSummary): void {
    const docCount = this.lines.length;
    const { outcomes } = summary;
    const failedFetches =
      (outcomes.skipped ?? 0) + (outcomes.content_fetch_failed ?? 0);
    // `ai_success` lines with `success: false` are reviews dropped for a
    // failed score, so they don't count as useful work
    const committedReviews = this.lines.filter(
      (l) => l.outcome === "ai_success" && l.success,
    ).length;
    const message = { cycleId: this.cycleId, docCount, ...summary };

    if (committedReviews === 0 || failedFetches * 2 > docCount) {
      logger.error("reviewReportSink:unhealthy_cycle", message);
      return;
    }
    logger.info("reviewReportSink:summary", message);
  }

  async flush(kv: KVNamespace): Promise<void> {
    const endedAt = new Date().toISOString();
    const key = `cycle:${this.startedAt}:${this.cycleId}`;
    const summary = this.summarize();
    this.logSummary(summary);
    const payload = {
      cycleId: this.cycleId,
      startedAt: this.startedAt,
      endedAt,
      docCount: this.lines.length,
      summary,
      lines: this.lines,
    };

    try {
      await kv.put(key, JSON.stringify(payload), {
        expirationTtl: TTL_SECONDS,
      });
      logger.info(
        "reviewReportSink",
        `wrote cycle '${this.cycleId}' (${this.lines.length} lines)`,
      );
    } catch (error) {
      logger.error(
        "reviewReportSink",
        `failed to write cycle '${this.cycleId}': ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

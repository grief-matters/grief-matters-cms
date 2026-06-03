import { generateSanityDocKey } from "../sanity/utils";
import { logger } from "../utils/logger";
import type { AiReviewUsage } from "./ai-review";

export type ReviewOutcome =
  | "ai_success"
  | "ai_failed"
  | "skipped"
  | "disabled"
  | "content_fetch_failed";

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
};

const TTL_SECONDS = 90 * 24 * 60 * 60;

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

  async flush(kv: KVNamespace): Promise<void> {
    const endedAt = new Date().toISOString();
    const key = `cycle:${this.startedAt}:${this.cycleId}`;
    const payload = {
      cycleId: this.cycleId,
      startedAt: this.startedAt,
      endedAt,
      docCount: this.lines.length,
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

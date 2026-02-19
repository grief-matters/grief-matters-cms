export type LinkCheckStatus = "broken" | "warning" | "timeout" | "dns_error";

export interface BrokenLinkEntry {
  documentId: string;
  documentType: string;
  documentTitle: string;
  url: string;
  urlField: string;
  httpStatus: number | null;
  error: string;
  status: LinkCheckStatus;
  consecutiveFailures: number;
  firstFailedAt: string;
  lastCheckedAt: string;
}

export interface BrokenLinksReport {
  lastScanAt: string;
  totalChecked: number;
  totalDocuments: number;
  scanDurationMs: number;
  entries: BrokenLinkEntry[];
}

export type BuildStatus = "queued" | "initializing" | "running" | "stopped";

export type BuildOutcome =
  | "success"
  | "fail"
  | "skipped"
  | "cancelled"
  | "terminated";

export interface Build {
  build_uuid: string;
  status: BuildStatus;
  build_outcome: BuildOutcome | null;
  branch: string;
  created_on: string;
}

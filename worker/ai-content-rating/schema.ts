import z from "zod";

/**
 * The AI's structured quality-rating output. `qualityScore` mirrors the Sanity
 * `qualityScore` field's allowed values: `-1` means "N/A" (the content could
 * not be meaningfully scored), otherwise an integer 1-10. `rationale` is the
 * editorial justification surfaced to the human approver via `qualityScoreNotes`.
 */
export const zQualityRating = z.object({
  qualityScore: z.union([
    z.literal(-1),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  rationale: z.string(),
});

export type QualityRating = z.infer<typeof zQualityRating>;

/** Sentinel `qualityScore` value meaning the resource could not be scored. */
export const QUALITY_SCORE_NA = -1;

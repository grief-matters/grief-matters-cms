export const COVID_CAUSE_OF_DEATH_ID = "63e7fe34-82fb-4213-b384-e5dfbb515c42";

// Harvested from the 2026-05-14 production export: internet-resource documents
// that previously referenced one of the COVID-19 categories before those refs
// were stripped by an earlier migration. Source of truth for this backfill.
export const COVID_INTERNET_RESOURCE_IDS = [
  "0ZnW0npazvGoVPIKTjADNA",
  "0e6145cf-fd7d-401f-a241-82772d1970cc",
  "12171e00-186d-4e83-926f-d70df9d3c1fb",
  "50a7d429-6294-4e8e-b4e9-32f58aed83d9",
  "86vawedVb4YeKdtj4Z98MZ",
  "AAHkdvIOO93sDM54N3EYgd",
  "c398a342-f748-46d7-8956-eba88b9ce602",
  "c626bb9b-9750-47f8-9103-3677b11e3032",
  "e897198d-f5af-4188-9efe-247dbd2451d9",
  "e8cc565e-2bec-4aa2-8060-2e8e46a1c61d",
  "f6198f0b-7b92-40cb-8394-6758ac4c5ce7",
  "f97447e7-685f-4c64-afad-33e09f185ef7",
  "imported-article-1098070876",
  "imported-article-1102826140",
  "imported-article-165411543",
  "imported-article-2108070486",
  "imported-article-2506307208",
  "imported-article-2611121542",
  "imported-article-2786312135",
  "imported-article-3153726541",
  "imported-article-3464658008",
  "imported-article-3673387535",
  "imported-article-3689159784",
  "imported-article-3841277475",
  "imported-article-4017931325",
  "imported-article-461438600",
  "imported-article-468113466",
  "imported-article-509453786",
  "imported-article-656506800",
  "imported-article-902494608",
  "imported-article-910110629",
  "imported-forum-1836332336",
  "imported-website-1836805704",
  "imported-website-1968555524",
  "imported-website-23802382",
  "imported-website-4228204352",
  "uXaJg6aeKN8ICisYgyqoj2",
] as const;

export const ALL_TARGET_IDS: readonly string[] = [
  ...COVID_INTERNET_RESOURCE_IDS,
  ...COVID_INTERNET_RESOURCE_IDS.map((id) => `drafts.${id}`),
];

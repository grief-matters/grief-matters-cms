export type NewTaxonomyType = "lossRelationship" | "causeOfDeath" | "topic";

/**
 * Maps every existing `category` slug to its destination doc type in the
 * decomposed taxonomy, or `null` for slugs that should not produce a new
 * tag doc.
 *
 * `null` covers two distinct cases:
 *   - Container / umbrella categories (e.g. `types-of-loss`, `emotions`,
 *     `loss-of-family-and-friends`) — pure navigation nodes that the new
 *     model drops in favour of frontend-coded nav (search-overhaul §1.6).
 *   - Supporter-side mirrors (e.g. `supporting-loss-of-parent`) — these
 *     should resolve to the same tag as their bereaved-side counterpart
 *     PLUS an `audience: supporter` tag, handled by a separate retag
 *     pass — not by creating a distinct tag doc.
 */
export const CATEGORY_CLASSIFICATION: Record<string, NewTaxonomyType | null> = {
  // ──────── lossRelationship ────────
  "general-pregnancy-loss": "lossRelationship",
  "loss-from-miscarriage": "lossRelationship",
  "loss-of-a-child": "lossRelationship",
  "loss-of-a-co-worker": "lossRelationship",
  "loss-of-a-friend": "lossRelationship",
  "loss-of-a-grandchild": "lossRelationship",
  "loss-of-a-grandparent": "lossRelationship",
  "loss-of-a-parent": "lossRelationship",
  "loss-of-a-pet": "lossRelationship",
  "loss-of-a-sibling": "lossRelationship",
  "loss-of-a-spouse-or-partner": "lossRelationship",
  "loss-relating-to-infertility": "lossRelationship",
  "neonatal-loss": "lossRelationship",
  "stillbirth-loss": "lossRelationship",

  // ──────── causeOfDeath ────────
  "alzheimers-disease-and-dementia": "causeOfDeath",
  cancer: "causeOfDeath",
  "cause-of-loss-covid-19": "causeOfDeath",
  "covid-19": "causeOfDeath",
  "death-in-the-line-of-duty": "causeOfDeath",
  homicide: "causeOfDeath",
  "motor-vehicle-plane-crash": "causeOfDeath",
  "other-illnesses": "causeOfDeath",
  "substance-abuse": "causeOfDeath",
  "sudden-traumatic-loss": "causeOfDeath",
  "suicide-loss": "causeOfDeath",

  // ──────── topic ────────
  "addressing-end-of-life-concerns": "topic",
  anger: "topic",
  "anxiety-and-fear": "topic",
  "benefits-of-support-groups": "topic",
  "bereavement-overload": "topic",
  "building-resilience": "topic",
  caregiving: "topic",
  "conversations-about-death": "topic",
  "coping-strategies": "topic",
  "do-men-grieve-differently": "topic",
  "feeling-abandoned-by-god": "topic",
  "feeling-numb": "topic",
  "finding-an-online-forum": "topic",
  "finding-online-support-groups": "topic",
  "for-the-newly-bereaved": "topic",
  "grief,-technology-and-social-media": "topic",
  "grief-in-the-workplace": "topic",
  guilt: "topic",
  "handling-the-estate-belongings-and-financial-issues": "topic",
  "helping-children-cope-with-loss": "topic",
  "holidays-and-other-significant-dates": "topic",
  "how-to-determine-if-the-bereaved-needs-additional-help": "topic",
  "immediately-following-the-death": "topic",
  "mental-health": "topic",
  "preparing-for-death": "topic",
  "prolonged-grief": "topic",
  "providing-support-after-a-violent-death": "topic",
  "providing-support-in-the-workplace": "topic",
  "psychic-mediums-and-continuing-bonds": "topic",
  relief: "topic",
  "sadness-and-depression": "topic",
  "self-care": "topic",
  "staying-connected": "topic",
  "support-based-on-religious-affiliation": "topic",
  "supporting-a-grieving-friend": "topic",
  "supporting-the-bereaved-during-the-holidays": "topic",
  "teens-and-young-adults-special-considerations": "topic",
  therapy: "topic",
  "tips-for-early-days-and-months-funerals-and-memorials": "topic",
  "understanding-grief": "topic",
  "what-is-grief": "topic",
  "what-to-bring-or-send": "topic",
  "what-to-say-and-what-not-to-say-to-the-bereaved": "topic",
  "what-to-say-in-writing": "topic",

  // ──────── skipped: pure containers / umbrella nav nodes ────────
  emotions: null,
  "finding-peer-support-and-support-groups": null,
  "loss-of-family-and-friends": null,
  "loss-through-illness": null,
  "pregnancy-and-fertility": null,
  "rarely-discussed-topics": null,
  "support-in-specific-situations": null,
  "supporting-the-bereaved": null,
  topics: null,
  "types-of-loss": null,

  // ──────── skipped: COVID intersection sub-pages ────────
  // (no clean home in the flat taxonomy; underlying resources will still
  // pick up `causeOfDeath: covid-19` via their other category refs)
  "covid-coping-strategies": null,
  "helping-children-and-teens-cope-with-loss-covid": null,
  "loss-of-a-loved-one-during-covid": null,

  // ──────── skipped: supporter-side mirrors ────────
  // (resources tagged with these resolve to the bereaved-side tag plus
  // `audience: supporter` in a later migration pass)
  "supporting-infertility-loss": null,
  "supporting-loss-from-miscarriage": null,
  "supporting-loss-of-a-child": null,
  "supporting-loss-of-a-grandchild": null,
  "supporting-loss-of-a-grandparent": null,
  "supporting-loss-of-parent": null,
  "supporting-neonatal-loss": null,
  "supporting-pet-loss": null,
  "supporting-pregnancy-loss": null,
  "supporting-sibling-loss": null,
  "supporting-spouse-or-partner-loss": null,
  "supporting-stillbirth-loss": null,
  "supporting-those-who-have-lost": null,
};

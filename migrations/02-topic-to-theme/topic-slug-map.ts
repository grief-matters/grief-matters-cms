type DocType =
  | "griefPhase"
  | "griefType"
  | "theme"
  | "contentFunction"
  | "emotionalState";

export const docTypeToFieldMap: Record<DocType, string> = {
  griefPhase: "griefPhases",
  griefType: "griefTypes",
  theme: "themes",
  contentFunction: "contentFunctions",
  emotionalState: "emotionalStates",
};

export const topicSlugs = [
  "rarely-discussed",
  "support-in-specific-situations",
  "for-the-newly-bereaved",
  "emotional-responses-to-grief",
  "finding-peer-support-and-support-groups",
  "grief-technology-and-social-media-old",
  "addressing-end-of-life-concerns-old",
  "anger-old",
  "anxiety-and-fear-old",
  "benefits-of-support-groups",
  "bereavement-overload",
  "building-resilience",
  "caregiving-old",
  "conversations-about-death-old",
  "coping-strategies",
  "do-men-grieve-differently",
  "feeling-abandoned-by-god",
  "feeling-numb",
  "finding-an-online-forum",
  "finding-online-support-groups",
  "grief-in-the-workplace-old",
  "guilt",
  "handling-the-estate-belongings-and-financial-issues",
  "helping-children-cope-with-loss",
  "holidays-and-other-significant-dates",
  "how-to-determine-if-the-bereaved-needs-additional-help",
  "immediately-following-the-death",
  "mental-health-old",
  "preparing-for-death",
  "prolonged-grief",
  "providing-support-after-a-violent-death",
  "providing-support-in-the-workplace",
  "psychic-mediums-and-continuing-bonds",
  "relief-old",
  "sadness-and-depression-old",
  "self-care",
  "staying-connected",
  "support-based-on-religious-affiliation",
  "supporting-a-grieving-friend",
  "supporting-the-bereaved-during-the-holidays",
  "teens-and-young-adults-special-considerations",
  "therapy",
  "tips-for-early-days-and-months-funerals-and-memorials",
  "understanding-grief",
  "what-is-grief",
  "what-to-bring-or-send",
  "what-to-say-and-what-not-to-say-to-the-bereaved",
  "what-to-say-in-writing",
] as const;
export type TopicSlug = (typeof topicSlugs)[number];

export const themeSlugs = [
  "holidays-and-significant-dates",
  "faith-and-spirituality",
  "navigating-relationships-while-grieving",
  "caregiving",
  "conversations-about-death",
  "grief-in-the-workplace",
  "handling-the-estate",
  "grief-technology-and-social-media",
  "addressing-end-of-life-concerns",
  "funerals-memorials-and-rituals",
  "continuing-bonds",
  "mental-health",
] as const;
type ThemeSlug = (typeof themeSlugs)[number];

export const emotionalStateSlugs = [
  "physical-symptoms",
  "loneliness",
  "relief",
  "guilt-and-regret",
  "sadness-and-depression",
  "anxiety-and-fear",
  "anger",
  "spiritual-distress",
  "numbness-and-shock",
] as const;
type EmotionSlug = (typeof emotionalStateSlugs)[number];

export const contentFunctionSlugs = [
  "meaning-making",
  "psychoeducation",
  "practical-logistical",
  "validation",
  "emotional-expression",
  "coping-skills",
  "community-connection",
  "professional-help-seeking",
] as const;
type FunctionSlug = (typeof contentFunctionSlugs)[number];

export const griefPhaseSlugs = [
  "integrating",
  "acute",
  "anticipatory",
  "prolonged",
] as const;
type PhaseSlug = (typeof griefPhaseSlugs)[number];

export const griefTypeSlugs = [
  "traumatic",
  "ambiguous",
  "disenfranchised",
  "collective",
  "cumulative",
] as const;
type GriefTypeSlug = (typeof griefTypeSlugs)[number];

type SlugForDocType = {
  griefPhase: PhaseSlug;
  griefType: GriefTypeSlug;
  theme: ThemeSlug;
  contentFunction: FunctionSlug;
  emotionalState: EmotionSlug;
};

type MigrationConfig = {
  [K in DocType]: {
    docType: K;
    slug: SlugForDocType[K];
  };
}[DocType];

export const topicSlugMigrationMap: Record<TopicSlug, MigrationConfig | null> =
  {
    "rarely-discussed": null,
    "support-in-specific-situations": null,
    "for-the-newly-bereaved": {
      docType: "griefPhase",
      slug: "acute",
    },
    "emotional-responses-to-grief": null,
    "finding-peer-support-and-support-groups": {
      docType: "contentFunction",
      slug: "community-connection",
    },
    "grief-technology-and-social-media-old": {
      docType: "theme",
      slug: "grief-technology-and-social-media",
    },
    "addressing-end-of-life-concerns-old": {
      docType: "theme",
      slug: "addressing-end-of-life-concerns",
    },
    "anger-old": {
      docType: "emotionalState",
      slug: "anger",
    },
    "anxiety-and-fear-old": {
      docType: "emotionalState",
      slug: "anxiety-and-fear",
    },
    "benefits-of-support-groups": {
      docType: "contentFunction",
      slug: "community-connection",
    },
    "bereavement-overload": {
      docType: "griefType",
      slug: "cumulative",
    },
    "building-resilience": {
      docType: "contentFunction",
      slug: "meaning-making",
    },
    "caregiving-old": {
      docType: "theme",
      slug: "caregiving",
    },
    "conversations-about-death-old": {
      docType: "theme",
      slug: "conversations-about-death",
    },
    "coping-strategies": {
      docType: "contentFunction",
      slug: "coping-skills",
    },
    "do-men-grieve-differently": null,
    "feeling-abandoned-by-god": {
      docType: "theme",
      slug: "faith-and-spirituality",
    },
    "feeling-numb": {
      docType: "emotionalState",
      slug: "numbness-and-shock",
    },
    "finding-an-online-forum": {
      docType: "contentFunction",
      slug: "community-connection",
    },
    "finding-online-support-groups": {
      docType: "contentFunction",
      slug: "community-connection",
    },
    "grief-in-the-workplace-old": {
      docType: "theme",
      slug: "grief-in-the-workplace",
    },
    guilt: {
      docType: "emotionalState",
      slug: "guilt-and-regret",
    },
    "handling-the-estate-belongings-and-financial-issues": {
      docType: "theme",
      slug: "handling-the-estate",
    },
    "helping-children-cope-with-loss": null,
    "holidays-and-other-significant-dates": {
      docType: "theme",
      slug: "holidays-and-significant-dates",
    },
    "how-to-determine-if-the-bereaved-needs-additional-help": {
      docType: "contentFunction",
      slug: "professional-help-seeking",
    },
    "immediately-following-the-death": {
      docType: "griefPhase",
      slug: "acute",
    },
    "mental-health-old": {
      docType: "theme",
      slug: "mental-health",
    },
    "preparing-for-death": {
      docType: "griefPhase",
      slug: "anticipatory",
    },
    "prolonged-grief": {
      docType: "griefPhase",
      slug: "prolonged",
    },
    "providing-support-after-a-violent-death": {
      docType: "griefType",
      slug: "traumatic",
    },
    "providing-support-in-the-workplace": {
      docType: "theme",
      slug: "grief-in-the-workplace",
    },
    "psychic-mediums-and-continuing-bonds": {
      docType: "theme",
      slug: "continuing-bonds",
    },
    "relief-old": {
      docType: "emotionalState",
      slug: "relief",
    },
    "sadness-and-depression-old": {
      docType: "emotionalState",
      slug: "sadness-and-depression",
    },
    "self-care": {
      docType: "contentFunction",
      slug: "coping-skills",
    },
    "staying-connected": {
      docType: "theme",
      slug: "continuing-bonds",
    },
    "support-based-on-religious-affiliation": {
      docType: "theme",
      slug: "faith-and-spirituality",
    },
    "supporting-a-grieving-friend": null,
    "supporting-the-bereaved-during-the-holidays": {
      docType: "theme",
      slug: "holidays-and-significant-dates",
    },
    "teens-and-young-adults-special-considerations": null,
    therapy: {
      docType: "contentFunction",
      slug: "professional-help-seeking",
    },
    "tips-for-early-days-and-months-funerals-and-memorials": {
      docType: "theme",
      slug: "funerals-memorials-and-rituals",
    },
    "understanding-grief": {
      docType: "contentFunction",
      slug: "psychoeducation",
    },
    "what-is-grief": {
      docType: "contentFunction",
      slug: "psychoeducation",
    },
    "what-to-bring-or-send": {
      docType: "contentFunction",
      slug: "practical-logistical",
    },
    "what-to-say-and-what-not-to-say-to-the-bereaved": {
      docType: "contentFunction",
      slug: "practical-logistical",
    },
    "what-to-say-in-writing": {
      docType: "contentFunction",
      slug: "practical-logistical",
    },
  };

import z from "zod";

import { days, timezones } from "../../shared/datetime";
import { contactTypes } from "../../shared/contact-type";

import type { InternetResourceType } from "../../shared/internet-resource";

export type AiReview =
  | z.infer<typeof zDefaultReview>
  | z.infer<typeof zAppReview>
  | z.infer<typeof zCrisisResourceReview>
  | z.infer<typeof zEssentialServiceReview>;

export type AiReviewFieldKey =
  | keyof typeof zDefaultReview.shape
  | keyof typeof zAppReview.shape
  | keyof typeof zCrisisResourceReview.shape
  | keyof typeof zEssentialServiceReview.shape;

export type AiAvailability = z.infer<typeof zAiAvailability>;
export type AiContactMethod = z.infer<typeof zAiContactMethod>;

// Fields shared by all Internet Resource types
const zReviewBaseFields = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  availableLanguages: z.array(z.enum(["english", "spanish"])).nullable(),
  searchAliases: z.array(z.string()).nullable(),
  paywalled: z.boolean().nullable(),
  registrationRequired: z.boolean().nullable(),
});

// Reference fields (i.e. fields referencing other Sanity documents)
const zLossRelationshipRefs = z.object({
  lossRelationships: z.array(z.string()),
});
const zCauseOfDeathRefs = z.object({ causesOfDeath: z.array(z.string()) });
const zThemeRefs = z.object({ themes: z.array(z.string()) });
const zDemographicRefs = z.object({ demographics: z.array(z.string()) });
const zGriefPhaseRefs = z.object({ griefPhases: z.array(z.string()) });
const zGriefTypeRefs = z.object({ griefTypes: z.array(z.string()) });
const zContentFunctionRefs = z.object({
  contentFunctions: z.array(z.string()),
});
const zEmotionalStateRefs = z.object({ emotionalStates: z.array(z.string()) });
export const zAllRefs = z.object({
  ...zLossRelationshipRefs.shape,
  ...zCauseOfDeathRefs.shape,
  ...zThemeRefs.shape,
  ...zDemographicRefs.shape,
  ...zGriefPhaseRefs.shape,
  ...zGriefTypeRefs.shape,
  ...zContentFunctionRefs.shape,
  ...zEmotionalStateRefs.shape,
});

// Fields not used by all types
const zAiAvailability = z.object({
  days: z.array(z.enum(days)),
  availableFrom: z.string(),
  availableTo: z.string(),
  timezone: z.enum(timezones),
});

const zAiContactMethod = z.object({
  contactType: z.enum(contactTypes),
  telephoneNumber: z.string().nullable(),
  smsBody: z.string().nullable(),
  email: z.string().nullable(),
  contactForm: z.string().nullable(),
  liveChatUrl: z.string().nullable(),
  availabilities: z.array(zAiAvailability).nullable(),
});

const zContactMethodsField = z.object({
  contactMethods: z.array(zAiContactMethod).nullable(),
});

const zAudienceField = z.object({
  audienceRole: z
    .array(z.enum(["bereaved", "supporter", "professional"]))
    .nullable(),
});

// Final schemas used for review output validation
export const zDefaultReview = z.object({
  ...zReviewBaseFields.shape,
  ...zAllRefs.shape,
  ...zAudienceField.shape,
});

const zAppReview = z.object({
  ...zReviewBaseFields.shape,
  ...zAllRefs.shape,
});

const zCrisisResourceReview = z.object({
  ...zReviewBaseFields.shape,
  ...zContactMethodsField.shape,
});

const zEssentialServiceReview = z.object({
  ...zReviewBaseFields.shape,
  ...zThemeRefs.shape,
  ...zDemographicRefs.shape,
  ...zContactMethodsField.shape,
});

/**
 * Picks the Zod schema describing the AI's structured output for a given
 * resource type: crisis resources get contact methods, apps get the base
 * schema, everything else gets the audience-role variant.
 *
 * @param docType
 * @returns
 */
export function getOutputSchemaForDocType(
  docType: InternetResourceType,
): z.ZodObject {
  switch (docType) {
    case "crisisResource":
      return zCrisisResourceReview;
    case "app":
      return zAppReview;
    case "essentialService":
      return zEssentialServiceReview;
    default:
      return zDefaultReview;
  }
}

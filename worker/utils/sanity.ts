import {
  createClient,
  type SanityDocument,
  type SanityClient,
} from "@sanity/client";
import groq from "groq";

import z from "zod";
import type { InternetResourceType } from "../../types";
import { days, timezones, contactTypes } from "../../constants";

export type RefDoc = {
  _id: string;
  title: string;
  description: string;
};

const zPatchSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  availableLanguages: z.array(z.enum(["english", "spanish"])).nullable(),
  searchAliases: z.array(z.string()).nullable(),
  paywalled: z.boolean().nullable(),
  registrationRequired: z.boolean().nullable(),
  lossRelationships: z.array(z.string()).nullable(),
  causesOfDeath: z.array(z.string()).nullable(),
  themes: z.array(z.string()).nullable(),
  demographics: z.array(z.string()).nullable(),
  griefPhases: z.array(z.string()).nullable(),
  griefTypes: z.array(z.string()).nullable(),
  contentFunctions: z.array(z.string()).nullable(),
  emotionalStates: z.array(z.string()).nullable(),
});

const zPatchWithAudience = z.object({
  ...zPatchSchema.shape,
  audienceRole: z
    .array(z.enum(["bereaved", "supporter", "professional"]))
    .nullable(),
});

const zContactAvailability = z.object({
  days: z.enum(days),
  availableFrom: z.string(),
  availableTo: z.string(),
  timezone: z.enum(timezones),
});

const zContactType = z.enum(contactTypes);
const zTelephoneNumber = z.object({ telephoneNumber: z.string() });
const zEmail = z.object({ email: z.string() });
const zContactForm = z.object({ contactForm: z.string() });
const zLiveChat = z.object({ liveChatUrl: z.string() });

const zContactMethod = z.discriminatedUnion("contactType", [
  z.object({
    ...zTelephoneNumber.shape,
    ...zContactAvailability.shape,
    contactType: z.literal(zContactType.enum.tel),
  }),
  z.object({
    ...zTelephoneNumber.shape,
    ...zContactAvailability.shape,
    contactType: z.literal(zContactType.enum.tty),
  }),
  z.object({
    ...zTelephoneNumber.shape,
    ...zContactAvailability.shape,
    contactType: z.literal(zContactType.enum.sms),
  }),
  z.object({
    ...zEmail.shape,
    contactType: z.literal(zContactType.enum.email),
  }),
  z.object({
    ...zContactForm.shape,
    contactType: z.literal(zContactType.enum.contactForm),
  }),
  z.object({
    ...zContactAvailability.shape,
    ...zLiveChat.shape,
    contactType: z.literal(zContactType.enum.liveChat),
  }),
]);

const zPatchWithContactMethods = z.object({
  ...zPatchSchema.shape,
  contactMethods: z.array(zContactMethod).nullable(),
});

export type AiReviewResponse =
  | z.infer<typeof zPatchSchema>
  | z.infer<typeof zPatchWithAudience>
  | z.infer<typeof zPatchWithContactMethods>;

export type SanityInternetResourcePatch = Partial<{
  [K in keyof AiReviewResponse]: NonNullable<AiReviewResponse[K]>;
}>;

export type TaxonomyDocType =
  | "lossRelationship"
  | "causeOfDeath"
  | "theme"
  | "demographic"
  | "griefPhase"
  | "griefType"
  | "emotionalState"
  | "contentFunction";

const refFields = new Set([
  "lossRelationships",
  "causesOfDeath",
  "themes",
  "demographics",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
]);

let client: SanityClient | null = null;

export function getSanityClient(env: Env): SanityClient {
  if (client === null) {
    client = createClient({
      projectId: env.SANITY_STUDIO_PROJECT_ID,
      dataset: env.SANITY_STUDIO_DATASET,
      apiVersion: env.SANITY_STUDIO_API_VERSION,
      token: env.SANITY_API_AUTH_TOKEN,
      useCdn: false,
      perspective: "raw",
    });
  }

  return client;
}

export function getReferenceTaxonomies(
  env: Env,
): Promise<Record<TaxonomyDocType, RefDoc[]>> {
  const client = getSanityClient(env);

  return client.fetch(groq`{
    "lossRelationship": *[_type == 'lossRelationship']{_id, title, "description": shortDescription},
    "causeOfDeath": *[_type == 'causeOfDeath']{_id, title, "description": shortDescription},
    "theme": *[_type == 'theme']{_id, title, "description": shortDescription},
    "demographic": *[_type == 'demographic']{_id, title, description},
    "griefPhase": *[_type == 'griefPhase']{_id, title, description},
    "griefType": *[_type == 'griefType']{_id, title, description},
    "emotionalState": *[_type == 'emotionalState']{_id, title, description},
    "contentFunction": *[_type == 'contentFunction']{_id, title, description},
  }`);
}

export async function getAuditableDocsByTypes(
  env: Env,
  types: Array<string>,
  limit: number = 10,
) {
  const client = getSanityClient(env);

  const docs = await client.fetch<SanityDocument[]>(
    groq`
      *[
        _type in $docTypes
        && !(_id in path('drafts.**'))
        && !defined(*[_id == "drafts." + ^._id][0])
        && skipLinkCheck != true
      ] | order(_updatedAt asc)[0..$limit]
    `,
    {
      docTypes: types,
      limit: limit - 1,
    },
  );

  return docs;
}

export function getSanityDocFromReviewAction(
  doc: SanityDocument,
  patch: SanityInternetResourcePatch,
): SanityDocument {
  const { _id, _rev, _createdAt, _updatedAt, ...rest } = doc;
  const result: Record<string, unknown> = { ...rest };
  for (const [key, value] of Object.entries(patch)) {
    if (refFields.has(key) && Array.isArray(value)) {
      result[key] = toSanityReferences(value as string[]);
    } else {
      result[key] = value;
    }
  }

  return {
    _id: `drafts.${doc._id}`,
    ...result,
  } as SanityDocument;
}

export function generateKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export function toSanityReferences(ids: string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: generateKey(),
  }));
}

export function getOutputSchemaForDocType(
  docType: InternetResourceType,
):
  | typeof zPatchSchema
  | typeof zPatchWithAudience
  | typeof zPatchWithContactMethods {
  switch (docType) {
    case "app":
      return zPatchSchema;
    case "crisisResource":
      return zPatchWithContactMethods;
    default:
      return zPatchWithAudience;
  }
}

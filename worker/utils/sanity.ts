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

// Reference array fields are intentionally non-nullable: Anthropic structured
// outputs has a 16-parameter limit on union-typed fields. The AI always emits
// the desired final ref list (the existing doc is supplied in the user message),
// so re-emitting the current refs is a no-op write.
const zPatchSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  availableLanguages: z.array(z.enum(["english", "spanish"])).nullable(),
  searchAliases: z.array(z.string()).nullable(),
  paywalled: z.boolean().nullable(),
  registrationRequired: z.boolean().nullable(),
  lossRelationships: z.array(z.string()),
  causesOfDeath: z.array(z.string()),
  themes: z.array(z.string()),
  demographics: z.array(z.string()),
  griefPhases: z.array(z.string()),
  griefTypes: z.array(z.string()),
  contentFunctions: z.array(z.string()),
  emotionalStates: z.array(z.string()),
});

const zPatchWithAudience = z.object({
  ...zPatchSchema.shape,
  audienceRole: z
    .array(z.enum(["bereaved", "supporter", "professional"]))
    .nullable(),
});

// These schemas are simplified vs the Sanity schemas to avoid 'compiled grammar too large' errors with Claude
const zAvailability = z.object({
  days: z.array(z.enum(days)),
  availableFrom: z.string(),
  availableTo: z.string(),
  timezone: z.enum(timezones),
});

const zContactMethod = z.object({
  contactType: z.enum(contactTypes),
  telephoneNumber: z.string().nullable(),
  smsBody: z.string().nullable(),
  email: z.string().nullable(),
  contactForm: z.string().nullable(),
  liveChatUrl: z.string().nullable(),
  availabilities: z.array(zAvailability).nullable(),
});

const zPatchWithContactMethods = z.object({
  ...zPatchSchema.shape,
  contactMethods: z.array(zContactMethod).nullable(),
});

type ContactType = (typeof contactTypes)[number];
type AiContactMethod = z.infer<typeof zContactMethod>;

const contactMethodFieldsByType: Record<
  ContactType,
  ReadonlyArray<keyof AiContactMethod>
> = {
  tel: ["telephoneNumber", "availabilities"],
  tty: ["telephoneNumber", "availabilities"],
  sms: ["telephoneNumber", "smsBody", "availabilities"],
  email: ["email"],
  contactForm: ["contactForm"],
  liveChat: ["liveChatUrl", "availabilities"],
};

export function normalizeContactMethods(
  contactMethods: AiContactMethod[] | null,
): Array<Record<string, unknown>> | null {
  if (contactMethods === null) {
    return null;
  }

  return contactMethods.map((method) => {
    const allowedFields = new Set<string>([
      "contactType",
      ...contactMethodFieldsByType[method.contactType],
    ]);

    const result: Record<string, unknown> = {
      _type: "contactMethod",
      _key: generateKey(),
    };

    for (const [key, value] of Object.entries(method)) {
      if (allowedFields.has(key) && value !== null) {
        result[key] = value;
      }
    }
    return result;
  });
}

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

export function isRefField(key: string): boolean {
  return refFields.has(key);
}

export function refIdsChanged(
  newIds: readonly string[],
  existing: unknown,
): boolean {
  const current = Array.isArray(existing)
    ? existing
        .map((r) => (r as { _ref?: unknown })._ref)
        .filter((id): id is string => typeof id === "string")
    : [];
  if (current.length !== newIds.length) {
    return true;
  }
  const seen = new Set(current);
  return newIds.some((id) => !seen.has(id));
}

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

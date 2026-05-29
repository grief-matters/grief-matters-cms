import { isEqualWith } from "lodash";
import type { SanityDocument } from "sanity";
import type { Any, AttributeSet } from "@sanity/client";

import { isRefField } from "../../shared/internet-resource";
import type {
  AiAvailability,
  AiContactMethod,
  AiReview,
} from "../ai-content-review/ai-review";
import type { ContactType } from "../../shared/contact-type";

export type RefDoc = {
  _id: string;
  title: string;
  description: string;
};

export type SanityMutationDescriptor = {
  pubId: string;
  pubRev: string;
  pubPatch: AttributeSet;
  draft?: Any;
};

const contactMethodFieldsByType: Record<
  ContactType,
  ReadonlyArray<keyof Omit<AiContactMethod, "contactType">>
> = {
  tel: ["telephoneNumber", "availabilities"],
  tty: ["telephoneNumber", "availabilities"],
  sms: ["telephoneNumber", "smsBody", "availabilities"],
  email: ["email"],
  contactForm: ["contactForm"],
  liveChat: ["liveChatUrl", "availabilities"],
};

/**
 * Wraps a flat list of document _ids into Sanity reference objects, each with
 * a fresh `_key` so they're valid as array items.
 *
 * @param ids
 * @returns
 */
function toSanityReferences(ids: string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: generateSanityDocKey(),
  }));
}

/**
 * Wraps an AI-emitted availability window as a Sanity `availability` object
 * with the required `_type` and `_key`.
 *
 * @param availability
 * @returns
 */
function toSanityAvailability(availability: AiAvailability) {
  return {
    _type: "availability",
    _key: generateSanityDocKey(),
    ...availability,
  };
}

/**
 * Wraps an AI-emitted contact method as a Sanity `contactMethod`, copying only
 * the value fields applicable to its `contactType` (per
 * `contactMethodFieldsByType`) and converting nested availabilities. The AI
 * schema is flat with everything nullable; this is where we discard the noise.
 *
 * @param method
 * @returns
 */
function toSanityContactMethod(
  method: AiContactMethod,
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    _type: "contactMethod",
    _key: generateSanityDocKey(),
    contactType: method.contactType,
  };

  for (const field of contactMethodFieldsByType[method.contactType]) {
    const value = method[field];
    if (value === null) {
      continue;
    }

    if (field === "availabilities" && Array.isArray(value)) {
      result[field] = value.map(toSanityAvailability);
      continue;
    }

    result[field] = value;
  }

  return result;
}

/**
 * Merges an AI review onto the existing published doc to produce a draft
 * document. Null scalar fields in the review are treated as "no change" (kept
 * from the existing doc); reference arrays and contactMethods are converted
 * into their Sanity shapes. The result's `_id` is prefixed with `drafts.` so
 * Sanity treats it as a draft of the existing doc.
 *
 * @param review
 * @param existingDoc
 * @returns
 */
export function getDraftDocumentFromAiReview(
  review: AiReview,
  existingDoc: SanityDocument,
): SanityDocument {
  const { _id, _rev, _createdAt, _updatedAt, ...rest } = existingDoc;

  const result: Record<string, unknown> = { ...rest };

  for (const [key, value] of Object.entries(review)) {
    if (value === null) {
      continue;
    }

    if (isRefField(key) && Array.isArray(value)) {
      result[key] = toSanityReferences(value as string[]);
      continue;
    }

    if (key === "contactMethods" && Array.isArray(value)) {
      result[key] = (value as AiContactMethod[]).map(toSanityContactMethod);
      continue;
    }

    result[key] = value;
  }

  return {
    ...result,
    _id: `drafts.${existingDoc._id}`,
  } as SanityDocument;
}

const metaKeys = new Set(["_id", "_rev", "_createdAt", "_updatedAt", "_key"]);

export function draftHasChanges(
  draft: SanityDocument,
  original: SanityDocument,
): boolean {
  return !isEqualWith(draft, original, (_a, _b, key) => {
    if (typeof key === "string" && metaKeys.has(key)) {
      return true;
    }
    return undefined;
  });
}

export function getBaseMutationDescriptor(
  doc: SanityDocument,
): SanityMutationDescriptor {
  return {
    pubId: doc._id,
    pubRev: doc._rev,
    pubPatch: {
      aiAuditStamp: generateSanityDocKey(),
    },
  };
}

export function generateSanityDocKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

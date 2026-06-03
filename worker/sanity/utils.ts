import { isEqualWith } from "lodash";
import type { SanityDocument } from "sanity";
import type { Any, AttributeSet } from "@sanity/client";

import { isRefField } from "../../shared/internet-resource";
import type { ContactType } from "../../shared/contact-type";
import type {
  AiContactMethod,
  AiAvailability,
  AiReview,
} from "../ai-content-review/schema";

export type RefDoc = {
  _id: string;
  title: string;
  aiPromptHint: string;
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

export function countChangedFields(
  draft: SanityDocument,
  original: SanityDocument,
): number {
  const a = draft as Record<string, unknown>;
  const b = original as Record<string, unknown>;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let count = 0;
  for (const key of keys) {
    if (metaKeys.has(key)) {
      continue;
    }
    const eq = isEqualWith(a[key], b[key], (_x, _y, k) => {
      if (typeof k === "string" && metaKeys.has(k)) {
        return true;
      }
      return undefined;
    });
    if (!eq) {
      count++;
    }
  }
  return count;
}

export function getBaseMutationDescriptor(
  doc: SanityDocument,
  aiAuditStamp: string,
): SanityMutationDescriptor {
  return {
    pubId: doc._id,
    pubRev: doc._rev,
    pubPatch: {
      aiAuditStamp,
    },
  };
}

export function generateSanityDocKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

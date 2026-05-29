import type { SanityDocument } from "sanity";
import { isEqualWith } from "lodash";
import { isRefField } from "../../shared/internet-resource";
import type { AiContactMethod, AiReview } from "../ai-content-editor/ai-review";
import type { ContactType } from "../../shared/contact-type";
import type { Any, AttributeSet } from "@sanity/client";

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
 *
 * @param contactMethods
 * @returns
 */
function toSanityContactMethods(
  contactMethods: AiContactMethod[],
): Array<Record<string, unknown>> {
  return contactMethods.map((method) => {
    const allowedFields = new Set<string>([
      "contactType",
      ...contactMethodFieldsByType[method.contactType],
    ]);

    const result: Record<string, unknown> = {
      _type: "contactMethod",
      _key: generateSanityDocKey(),
    };

    for (const [key, value] of Object.entries(method)) {
      if (!allowedFields.has(key) || value === null) {
        continue;
      }

      if (key === "availabilities" && Array.isArray(value)) {
        result[key] = value.map((a) => ({
          _type: "availability",
          _key: generateSanityDocKey(),
          ...a,
        }));
        continue;
      }
      result[key] = value;
    }
    return result;
  });
}

/**
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

    if (key === "contactMethods") {
      const normalizedContactMethods = toSanityContactMethods(
        value as AiContactMethod[],
      );
      result[key] = normalizedContactMethods;
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

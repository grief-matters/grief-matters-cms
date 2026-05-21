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

export function createNonScrapablePatch(): { skipLinkCheck: true } {
  return { skipLinkCheck: true };
}

import type { CustomValidator } from "sanity";
import type { SanityClient } from "@sanity/client";

type TagDoc = {
  _id: string;
  _type: string;
  label: string;
  title?: string;
  name?: string;
  displayTitle?: string;
  slug?: string;
  searchAliases?: string[];
};

type TagDescriptor = { _id: string; _type: string; label: string };

type SearchConfig = {
  stopWords?: string[];
  domainNoiseWords?: string[];
};

type TagIndexEntry = { all: TagDescriptor[]; applied: TagDescriptor[] };

type SearchData = {
  noise: Set<string>;
  tagsByToken: Map<string, TagDescriptor[]>;
};

type AliasContext = {
  noise: Set<string>;
  textTokens: Set<string>;
  appliedTagIds: Set<string>;
  tagIndex: Map<string, TagIndexEntry>;
};

type TokenDisposition =
  | { kind: "applied"; tag: TagDescriptor }
  | { kind: "text" }
  | { kind: "unapplied"; tags: TagDescriptor[] }
  | { kind: "novel" };

type UnappliedDisposition = TokenDisposition & { kind: "unapplied" };

const tagTypes = [
  { type: "lossRelationship", field: "lossRelationships" },
  { type: "causeOfDeath", field: "causesOfDeath" },
  { type: "topic", field: "topics" },
  { type: "audience", field: "audiences" },
  { type: "griefPhase", field: "griefPhases" },
  { type: "contentFunction", field: "contentFunctions" },
  { type: "tone", field: "tones" },
] as const;

const tagDocTypes: string[] = tagTypes.map((t) => t.type);
const tagFieldNames: readonly string[] = tagTypes.map((t) => t.field);

const tokenize = (input: string): string[] =>
  input.toLowerCase().match(/\b[\w']+\b/g) ?? [];

const tagTokens = (tag: TagDoc): string[] => [
  ...tokenize(tag.title ?? ""),
  ...tokenize(tag.name ?? ""),
  ...tokenize(tag.displayTitle ?? ""),
  ...tokenize(tag.slug ?? ""),
  ...(tag.searchAliases ?? []).flatMap(tokenize),
];

async function loadSearchData(client: SanityClient): Promise<SearchData> {
  const result = await client.fetch<{
    config: SearchConfig | null;
    tags: TagDoc[] | null;
  }>(
    `{
      "config": *[_type == "searchConfiguration"][0]{stopWords, domainNoiseWords},
      "tags": *[_type in $tagTypes]{
        _id,
        _type,
        "label": coalesce(displayTitle, title, name, _id),
        title,
        name,
        displayTitle,
        "slug": slug.current,
        searchAliases
      }
    }`,
    { tagTypes: tagDocTypes }
  );

  const config = result.config;
  const tags = result.tags ?? [];

  const noise = new Set<string>(
    [...(config?.stopWords ?? []), ...(config?.domainNoiseWords ?? [])].flatMap(
      (w) => tokenize(w)
    )
  );

  const tagsByToken = new Map<string, TagDescriptor[]>();
  for (const tag of tags) {
    const desc: TagDescriptor = {
      _id: tag._id,
      _type: tag._type,
      label: tag.label,
    };
    for (const token of new Set(tagTokens(tag))) {
      if (noise.has(token)) {
        continue;
      }
      const list = tagsByToken.get(token) ?? [];
      list.push(desc);
      tagsByToken.set(token, list);
    }
  }

  return { noise, tagsByToken };
}

function collectAppliedTagIds(
  doc: Record<string, unknown> | undefined
): Set<string> {
  const ids = new Set<string>();
  if (!doc) {
    return ids;
  }
  for (const fieldName of tagFieldNames) {
    const arr = doc[fieldName];
    if (!Array.isArray(arr)) {
      continue;
    }
    for (const ref of arr) {
      if (
        ref &&
        typeof ref === "object" &&
        "_ref" in ref &&
        typeof (ref as { _ref?: unknown })._ref === "string"
      ) {
        ids.add((ref as { _ref: string })._ref);
      }
    }
  }
  return ids;
}

function buildAliasContext(
  doc: Record<string, unknown> | undefined,
  data: SearchData
): AliasContext {
  const title = typeof doc?.title === "string" ? doc.title : "";
  const description =
    typeof doc?.description === "string" ? doc.description : "";

  const textTokens = new Set<string>([
    ...tokenize(title),
    ...tokenize(description),
  ]);

  const appliedTagIds = collectAppliedTagIds(doc);

  const tagIndex = new Map<string, TagIndexEntry>();
  for (const [token, all] of data.tagsByToken) {
    const applied = all.filter((t) => appliedTagIds.has(t._id));
    tagIndex.set(token, { all, applied });
  }

  return {
    noise: data.noise,
    textTokens,
    appliedTagIds,
    tagIndex,
  };
}

function classifyToken(token: string, ctx: AliasContext): TokenDisposition {
  const entry = ctx.tagIndex.get(token);
  if (entry && entry.applied.length > 0) {
    return { kind: "applied", tag: entry.applied[0] };
  }
  if (ctx.textTokens.has(token)) {
    return { kind: "text" };
  }
  if (entry) {
    const unapplied = entry.all.filter((t) => !ctx.appliedTagIds.has(t._id));
    if (unapplied.length > 0) {
      return { kind: "unapplied", tags: unapplied };
    }
  }
  return { kind: "novel" };
}

function pickMinimalTagCover(
  unapplied: { token: string; d: UnappliedDisposition }[]
): TagDescriptor[] {
  const tagCovers = new Map<
    string,
    { tag: TagDescriptor; covers: Set<string> }
  >();
  for (const { token, d } of unapplied) {
    for (const candidate of d.tags) {
      const existing = tagCovers.get(candidate._id);
      if (existing) {
        existing.covers.add(token);
      } else {
        tagCovers.set(candidate._id, {
          tag: candidate,
          covers: new Set([token]),
        });
      }
    }
  }

  const remaining = new Set(unapplied.map(({ token }) => token));
  const chosen: TagDescriptor[] = [];
  while (remaining.size > 0) {
    let best: { tag: TagDescriptor; covers: Set<string> } | undefined;
    let bestSize = 0;
    for (const candidate of tagCovers.values()) {
      const overlap = [...candidate.covers].filter((t) =>
        remaining.has(t)
      ).length;
      if (overlap === 0) {
        continue;
      }
      if (
        overlap > bestSize ||
        (overlap === bestSize &&
          best &&
          candidate.tag.label.localeCompare(best.tag.label) < 0)
      ) {
        best = candidate;
        bestSize = overlap;
      }
    }
    if (!best) {
      break;
    }
    chosen.push(best.tag);
    for (const t of best.covers) {
      remaining.delete(t);
    }
  }
  return chosen;
}

function collectCoveredSources(
  dispositions: { token: string; d: TokenDisposition }[]
): string[] {
  const sources = new Set<string>();
  for (const { d } of dispositions) {
    if (d.kind === "applied") {
      sources.add(`applied tag '${d.tag.label}'`);
    } else if (d.kind === "text") {
      sources.add("title/description");
    }
  }
  return [...sources];
}

function describeAlias(alias: string, ctx: AliasContext): string | null {
  const tokens = tokenize(alias);
  if (tokens.length === 0) {
    return null;
  }

  const informative = tokens.filter((t) => !ctx.noise.has(t));
  if (informative.length === 0) {
    return `"${alias}": only stop or noise words — search will ignore it.`;
  }

  const dispositions = informative.map((token) => ({
    token,
    d: classifyToken(token, ctx),
  }));

  if (dispositions.some(({ d }) => d.kind === "novel")) {
    return null;
  }

  const unapplied = dispositions.filter(
    (e): e is { token: string; d: UnappliedDisposition } =>
      e.d.kind === "unapplied"
  );

  if (unapplied.length > 0) {
    const suggested = pickMinimalTagCover(unapplied);
    const tagPhrases = suggested.map((t) => `${t._type}: '${t.label}'`);
    const otherSources = collectCoveredSources(dispositions);
    if (otherSources.length > 0) {
      return `"${alias}": consider applying ${tagPhrases.join(
        " + "
      )} (other words already covered by ${otherSources.join(" + ")}).`;
    }
    return `"${alias}": consider applying ${tagPhrases.join(
      " + "
    )} rather than encoding it as an alias.`;
  }

  const sources = collectCoveredSources(dispositions);
  return `"${alias}": already covered by ${sources.join(" + ")}.`;
}

export const validateSearchAliases: CustomValidator<
  string[] | undefined
> = async (aliases, context) => {
  if (!aliases || aliases.length === 0) {
    return true;
  }

  const client = context.getClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  });

  const data = await loadSearchData(client);

  const doc = context.document as Record<string, unknown> | undefined;
  const ctx = buildAliasContext(doc, data);

  const messages: string[] = [];
  for (const alias of aliases) {
    if (typeof alias !== "string") {
      continue;
    }
    const msg = describeAlias(alias, ctx);
    if (msg !== null) {
      messages.push(msg);
    }
  }

  return messages.length === 0 ? true : messages.join(" — ");
};

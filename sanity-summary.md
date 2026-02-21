# Sanity Content Pipeline: whygriefmatters.org

## High-Level Architecture

Content flows through this pipeline: **Sanity Studio → GROQ Queries → Zod Validation → Astro Content Layer → Static Page Generation**. The entire site is statically generated at build time — there is no runtime data fetching. Every Sanity document ultimately maps to one or more statically rendered HTML pages.

---

## Content Types in Sanity

### 1. Internet Resources (18 document types)

The core content of the site. Each represents a curated external grief support resource.

**Basic Internet Resources** (16 types sharing identical schema):
`article`, `blog`, `book`, `community`, `course`, `forum`, `memorial`, `peerSupport`, `podcastEpisode`, `podcast`, `printedMaterial`, `story`, `supportGroup`, `therapyResource`, `video`, `webinar`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `resourceUrl` | URL | Required, the external link |
| `description` | string | Nullable |
| `image` | object `{ image, alt }` | Nullable. The `alt` field is remapped to `altText` |
| `sourceWebsite` | reference → `website` | Nullable. Dereferenced to ID only |
| `categories` | array of references → `category` | Dereferenced to IDs. Defaults to `[]` |
| `populations` | array of references → `population` | Dereferenced to IDs. Defaults to `[]` |

These are divided into **primary** (`article`, `story`, `peerSupport`, `supportGroup`, `therapyResource`, `website`) and **secondary** types for display ordering purposes.

**App** (`app`):
Same fields as above, plus:
- `appleUrl` — Apple App Store link (nullable)
- `playStoreUrl` — Google Play Store link (nullable)
- Validation: at least one of `resourceUrl`, `appleUrl`, or `playStoreUrl` must exist

**Website** (`website`):
Different shape from other resources:
- Uses `name` instead of `title`
- Uses `logo` (raw Sanity image) instead of the `image { image, alt }` wrapper
- No `sourceWebsite` reference (it IS a website)

### 2. Categories (`category`)

Hierarchical content taxonomy. Supports self-referential nesting.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `displayTitle` | string | Nullable, alternative display name |
| `slug` | slug | Used for URL generation |
| `shortDescription` | string | Nullable |
| `description` | Portable Text | Nullable, rendered on category pages |
| `image` | object `{ image, alt }` | Nullable |
| `subtopics` | array of references → `category` | Self-referential. Creates tree structure |
| `featuredResources` | array of references → any resource | Dereferenced to `{ refType, refId }` pairs |

**Three hardcoded root categories** serve as top-level navigation:
- "Topics" (`09c006f0-48ee-4ca2-b069-d445f9ca9803`)
- "Types of Loss" (`95e45462-a8a7-48cb-882d-407422534681`)
- "Supporting the Bereaved" (`ebae60a4-a7b6-412d-a72a-8a6e265c1107`)

### 3. Populations (`population`)

Target audience segments for resource filtering.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required |
| `slug` | slug | Predefined set of values |
| `description` | string | Nullable |
| `underserved` | boolean | Flags underserved communities |
| `image` | object `{ image, alt }` | Nullable |

**Known population slugs**: `latino-and-hispanic-americans`, `african-american-black`, `asian-american-and-pacific-islander`, `people-with-disabilities`, `lgbtq-community`, `indigenous-communities`

### 4. Content Blocks (`contentBlock`)

Flexible, composable page content. A content block contains an array of polymorphic content items discriminated by `_type`.

**15 content item types:**

| `_type` | Purpose | Key Fields |
|---------|---------|------------|
| `headingText` | Section heading | `text` |
| `richTextContentBlock` | Body text | `portableText`, `emphasized` (boolean) |
| `richTextWithHeading` | Headed text section | `headingText`, `portableText` |
| `accessibleImage` | Single image | `image`, `alt` |
| `imageRow` | Multiple images | `images[]` with `{ image, alt }` |
| `featuredResource` | Single resource callout | Reference → any resource type |
| `featuredResources` | Multiple resource callouts | Array of references → resources |
| `featuredWebsite` | Single website callout | Reference → `website` |
| `featuredWebsites` | Multiple website callouts | Array of references → `website` |
| `featuredCrisisResource` | Crisis resource (placeholder) | No fields (TODO) |
| `resourceLinks` | External link list | `resources[]` with `title`, `url`, `type` |
| `relativeLink` | Internal site link | `label`, `url` (must start with `/`) |
| `resourcePageLink` | Link to resource listing | `label`, `category`, `resourceTypes`, `population` |
| `categoryPageLink` | Link to category page | `category` reference, `label` |
| `pageLinks` | Collection of mixed links | `emphasized`, `showImages`, nested `links[]` |

### 5. Content Groups (`contentGroup`)

Page-level containers that organize content blocks in order.

| Field | Type | Notes |
|-------|------|-------|
| `slug` | slug | Used as the entry ID (e.g., `"home"` for homepage) |
| `title` | string | Nullable |
| `image` | object | Nullable |
| `contentBlocks` | array of references → `contentBlock` | Ordered list |

### 6. Organization (`organization-singleton`)

Singleton document for site-wide branding.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Organization name |
| `slogan` | string | Tagline |
| `legalName` | string | Legal entity name |
| `copyrightNotice` | string | Copyright text |
| `nonprofitNotice` | string | Nonprofit disclosure |
| `mission` | Portable Text | Rendered as `missionStatement` |
| `smallPrint` | Portable Text | Footer legal text |
| `logos` | array with `variant` field | Three variants: `onLight`, `onDark`, `onDarkMono` |

The `logos` field is an array where each item has a `variant` string and a `logo.image` Sanity image. The query restructures this into a flat object with three keys.

### 7. People & Person Groups

**Person** (`person`):

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | string | Used to generate URL slug (kebab-cased) |
| `role` | string | Nullable |
| `shortBio` | Portable Text | Nullable |
| `personalStory` | Portable Text | Nullable. If present, generates a dedicated page |
| `avatar` | Sanity image | Nullable |
| `socials` | object | Nullable. Contains `linkedIn` (URL) and `email` |

**Person Group** (`personGroup`):

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Group label |
| `description` | string | Nullable |
| `members` | array of references → `person` | Ordered member list |

### 8. Image Collection (`imageCollection`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Collection name |
| `images` | array of `{ image, alt }` | Used for fallback images |

---

## How Content Maps to Pages

| URL Pattern | Sanity Source | What's Displayed |
|-------------|--------------|------------------|
| `/` | `contentGroup` with slug `"home"` + `organization` | Content blocks, org branding, hero |
| `/topics/` | Root category `09c006f0...` | Subcategory summaries with resource counts |
| `/types-of-loss/` | Root category `95e45462...` | Subcategory summaries with resource counts |
| `/supporting-the-bereaved/` | Root category `ebae60a4...` | Subcategory summaries with resource counts |
| `/{categorySlug}/` | Individual `category` + all tagged resources | Category info, featured resources, resource listings grouped by type |
| `/{categorySlug}/{populationSlug}` | `category` × `population` intersection | Resources filtered by both category tree AND population |
| `/{populationSlug}` | `population` + pruned category trees | Category navigation filtered to show only branches with resources for that population |
| `/topics/{populationSlug}` | Root category × population | Filtered subcategory view |
| `/about/{kebab-name}` | `person` (only if `personalStory` exists) | Full bio, avatar, personal story |
| `/about/` | `personGroup` + `person` entries | Team overview |

**Important build-time behaviors:**
- Category pages compute **descendant category IDs** — a resource tagged with a child category also appears on parent category pages
- Category × Population pages are **only generated when resources exist** for that combination (no empty pages)
- Population landing pages **prune the full category tree** to remove branches with no resources for that population
- A `resourceExistenceSet` (Set of `categoryId:populationId` strings) enables O(1) lookup during tree pruning

---

## Image Handling

Sanity images are rendered via a `SanityImage.astro` component that:
- Generates responsive `srcSet` at widths: 320, 480, 640, 768, 1024, 1536, 2048, 2500px
- Serves WebP, JPG, and PNG formats
- Respects Sanity **hotspot** data for `object-position` CSS
- Supports **crop** data
- Uses a fallback image from an image collection (`bfd6483c-3f64-4d66-bd7c-646ffd69054e`) when no image is provided
- Supports square (1:1) and default (7:5) aspect ratios

The `alt` field in Sanity image objects is **critical** — it's the only source of alt text for accessibility.

---

## Portable Text Rendering

Portable Text is rendered to HTML using `@portabletext/to-html` and sanitized with `sanitize-html`.

**Supported block types**: `normal` (paragraphs), `bullet` lists, `number` lists

**Supported marks**: `strong`, `em`, `underline`, `strike-through`, `link` (with `href`)

**Used in**: Organization mission/smallPrint, Person bios/stories, Category descriptions, Content block rich text items

---

## Key Relationships for Studio Authors

1. **Categories ↔ Resources**: Many-to-many. Tagging a resource with a category makes it appear on that category page AND all ancestor category pages.

2. **Populations ↔ Resources**: Many-to-many. Tagging enables population-filtered views. Pages are only generated when resources exist for a combination.

3. **Categories ↔ Categories**: Hierarchical via `subtopics`. Three root categories are hardcoded as navigation entry points.

4. **Featured Resources on Categories**: Manually curated via `featuredResources` array. These appear prominently on category pages.

5. **Content Groups → Content Blocks**: Ordered composition. Content groups are page-level containers; content blocks are reusable content sections.

6. **Person Groups → People**: Ordered membership. Only people with `personalStory` get dedicated pages.

7. **Resources → Source Website**: Optional attribution link. The website's name/info may be displayed alongside the resource.

---

## What Matters Most for Studio Documentation

1. **The `categories` and `populations` arrays on resources are the primary content organization mechanism.** If a resource isn't tagged, it won't appear anywhere except potentially as a featured resource.

2. **The category hierarchy matters.** Resources "bubble up" to parent categories. Subcategory structure directly shapes site navigation.

3. **Population tagging drives page generation.** Empty category×population intersections produce no page — so tagging resources with appropriate populations expands the site's reach.

4. **Content blocks are the CMS-driven page builder.** The 15 content item types provide significant layout flexibility. Understanding which types are available and how they render is essential for content authors.

5. **Images need alt text.** The `alt` field flows directly to HTML `alt` attributes. Missing alt text degrades accessibility.

6. **The organization singleton controls site-wide branding** — logos, legal text, mission statement. It's fetched separately and cached.

7. **Featured resources are manually curated** on each category and rendered prominently. This is a key editorial tool.

8. **Slug fields generate URLs.** Category and population slugs directly become URL segments. Changing a slug would change the URL (and break existing links).

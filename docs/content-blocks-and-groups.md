---
title: Content Blocks & Groups
order: 5
---

# Content Blocks & Content Groups

Content Blocks and Content Groups are the page-building system of the CMS. They let you compose custom page layouts from reusable building blocks.

## Content Groups

A **Content Group** is a page-level container. Each content group maps to a specific page on the website via its slug. For example, the content group with slug `home` provides the content for the homepage.

### Content Group Fields

| Field | Purpose |
|-------|---------|
| **Name** | Internal label for finding this group in the Studio (not shown on the website) |
| **Title** | Optional display title shown to visitors |
| **Description** | Introductory text, usually shown in page headers |
| **Slug** | Links this group to a specific page on the website |
| **Image** | Optional cover image |
| **Content Blocks** | An ordered list of Content Block references — this is the page content |

The order of content blocks in the list determines their order on the page. You can drag to reorder them.

## Content Blocks

A **Content Block** is a reusable section of content. Each block has a name (for your reference in the Studio) and contains an ordered list of **content items**.

A single content block can contain multiple content items of different types — for example, a heading followed by some text and then a featured resource.

### Content Block Fields

| Field | Purpose |
|-------|---------|
| **Name** | Internal label for organizing blocks in the Studio (not displayed to visitors) |
| **Content** | An ordered list of content items (see below) |

## Content Item Types

Content items are the individual pieces that make up a content block. There are 15 types:

### Text Items

| Type | What It Does |
|------|-------------|
| **Heading Text** | A section heading (plain text) |
| **Rich Text** | A block of formatted text (supports bold, italic, underline, strikethrough, links). Can be marked as "prominent" for emphasis |
| **Rich Text With Heading** | A heading paired with a rich text block — keeps them together as a unit |

### Image Items

| Type | What It Does |
|------|-------------|
| **Accessible Image** | A single image with required alt text and image source tracking |
| **Image Row** | A row of 2–6 images displayed side by side |

### Resource Callouts

| Type | What It Does |
|------|-------------|
| **Featured Resource** | Highlights a single internet resource with its details |
| **Featured Resources** | Highlights multiple internet resources as a collection |
| **Featured Website** | Highlights a single website (with optional logo display) |
| **Featured Websites** | Highlights multiple websites |
| **Featured Crisis Resource** | Displays a crisis resource |

### Link Items

| Type | What It Does |
|------|-------------|
| **Relative Link** | A link to an internal page on the website (URL must start with `/`) |
| **Resource Page Link** | A link to a filtered resource listing page — you can filter by category, resource type, and/or population |
| **Category Page Link** | A link to a category page (optionally with a custom label) |
| **Page Links** | A mixed collection of links (can combine relative links, resource page links, and category page links). Can be marked as "prominent" and optionally show images |

### External Links

| Type | What It Does |
|------|-------------|
| **Resource Links** | A list of references to internet resources, displayed as external links |

## Building a Page

To compose a page:

1. **Create Content Blocks** with the content items you need
2. **Create a Content Group** (or edit an existing one) and set its slug to match the target page
3. **Add Content Block references** to the Content Group in the order you want them displayed
4. Content blocks are reusable — the same block can appear in multiple content groups if needed

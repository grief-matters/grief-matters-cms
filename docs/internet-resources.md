---
title: Internet Resources
order: 4
---

# Internet Resources

Internet resources are the core content of the site — curated links to external grief support materials. Each resource points to something useful on the web and is organized by type, category, and population.

## Resource Types

There are 18 types of internet resource. Choose the type that best describes the content you're linking to:

| Type | Description |
|------|-------------|
| **App** | Mobile or web applications (with App Store / Play Store links) |
| **Article** | Written content from external sites |
| **Blog** | Blog posts or ongoing blog series |
| **Book** | Published books (physical or digital) |
| **Community** | Online communities and groups |
| **Course** | Online courses or educational programs |
| **Forum** | Discussion forums |
| **Memorial** | Memorial or tribute sites |
| **Peer Support** | Peer-to-peer support platforms |
| **Podcast** | Podcast series (with Spotify / Apple Podcasts links) |
| **Podcast Episode** | Individual podcast episodes |
| **Printed Material** | Pamphlets, brochures, and other printed resources available online |
| **Story** | Personal grief stories and narratives |
| **Support Group** | Online or in-person support groups |
| **Therapy Resource** | Therapeutic tools and professional resources |
| **Video** | Video content |
| **Webinar** | Recorded or upcoming webinars |
| **Website** | General grief support websites (see the separate [Websites](websites) doc for details) |

## Shared Fields

All internet resource types (except Website, which has a slightly different structure) share these fields:

### Main Tab

| Field | Details |
|-------|---------|
| **Title** | The resource name. Max 60 characters recommended — shorter titles work better for users. |
| **URL** | Link to the external resource. The input includes a "Go to URL" link so you can verify the resource is still active. |
| **Description** | Plain text summary of the resource. Max 255 characters recommended. Avoid adding links here. |
| **Source Website** | Optional reference to a Website document for attribution. Not usually needed unless the website specializes in grief-related content. |
| **Categories** | Which categories this resource belongs to. **Required** unless a population is specified or broad focus is enabled. |
| **Populations** | Which audience segments this resource is relevant to. |
| **Rating** | A 1–10 star rating. Click a star to set the rating; use the reset button to clear it. Must be a whole number. |
| **Image** | An image shown alongside the resource, usually only displayed when the resource is featured on a category page. |

### Search & SEO Tab

| Field | Details |
|-------|---------|
| **Keywords** | Up to 10 single-word tags (use hyphens instead of spaces). Helps with search relevance. |
| **SEO Phrases** | Up to 10 multi-word phrases for search optimization. |

## Type-Specific Fields

Some resource types have additional fields beyond the shared ones:

### App

- **Apple App Store URL** — Must be an `apps.apple.com` link
- **Google Play Store URL** — Must be a `play.google.com/store/apps` link
- At least one URL is required (the main URL, Apple URL, or Play Store URL)

### Book

- **Author** — The book's author
- **ISBN** — The book's ISBN (10 or 13 digits)

### Podcast

- **Spotify URL** — Link to the podcast on Spotify
- **Apple Podcasts URL** — Link on Apple Podcasts
- At least one URL is required (the main URL, Spotify URL, or Apple URL)

### Article, Story, Therapy Resource

- **Available in Spanish** — Toggle indicating a Spanish version exists

### Support Group

- **Broad Focus** — When enabled, the resource surfaces across all categories (and the categories field is no longer required)
- **Format** — "In person" or "Virtual"

### Forum

- **Broad Focus** — Same as Support Group (surfaces across all categories)

## Converting Between Types

If a resource was created as the wrong type, you can convert it:

1. **Unpublish** the resource first (convert only works on drafts)
2. Open the document actions menu (the **⋯** button)
3. Select **Convert**
4. Choose the new type

Shared fields (title, URL, description, categories, etc.) are preserved. Type-specific fields (like App Store URLs or ISBN) will be lost if the new type doesn't have them.

## Best Practices

- **Verify URLs** — Click the "Go to URL" link to confirm the resource is still active and points to the right content
- **Write concise descriptions** — Stay under 255 characters. Describe what the resource offers, not just what it is
- **Always assign categories** — Resources without categories won't appear in the site's navigation. Tag with the most specific category; the resource will bubble up to parent categories automatically
- **Add images for featured placement** — If a resource might be featured on a category page, make sure it has an image. You'll see a warning when featuring resources without images
- **Use populations thoughtfully** — Tagging a resource with a population adds it to population-filtered pages and can trigger new page generation

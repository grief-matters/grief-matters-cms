---
title: Categories & Populations
order: 3
---

# Categories & Populations

Categories and populations are the two main ways content is organized on the website.

## Categories

Categories form a **hierarchical tree** — the primary navigation structure of the site. Every internet resource and crisis resource should be tagged with at least one category so it appears on the website.

### The Three Root Categories

The site has three top-level categories that serve as main navigation entry points:

- **Topics** — Subject-matter categories (e.g., grief in the workplace, children and grief)
- **Types of Loss** — Categories based on the type of loss experienced (e.g., loss of a spouse, loss of a child)
- **Supporting the Bereaved** — Resources for people supporting someone who is grieving

Each root category has subcategories beneath it, creating a tree structure.

### How the Hierarchy Works

Resources **bubble up** through the category tree. If you tag a resource with a subcategory, it also appears on all parent category pages. For example, a resource tagged with "Loss of a Spouse" (a subcategory of "Types of Loss") will appear on both the "Loss of a Spouse" page and the "Types of Loss" page.

This means you should tag resources with the **most specific** category that applies — they'll automatically appear in broader categories too.

### Category Fields

| Field | Purpose |
|-------|---------|
| **Title** | The category name displayed within the category hierarchy (max 60 characters recommended) |
| **Display Title** | An alternative title used when the category is shown outside the hierarchy (optional) |
| **Slug** | URL segment for this category — becomes part of the page URL |
| **Short Description** | Brief summary (max 255 characters recommended) |
| **Description** | Longer rich text description shown on the category page |
| **Image** | Cover image for the category |
| **Subcategories** | References to child categories that appear under this one |
| **Featured Resources** | Up to 3 hand-picked resources displayed prominently on the category page |

### Featured Resources

Each category can have up to **3 featured resources** that are displayed prominently on its page. Keep in mind:

- Featured resources should have images — you'll see a warning if they don't
- Resources should already belong to the category (or one of its subcategories) to make sense as a featured item
- Featured placement is a key editorial tool for highlighting the best content

### Slugs and URLs

A category's slug becomes its URL segment. The category with slug `coping-strategies` produces the URL `/coping-strategies/`.

**Do not change slugs** on published categories without good reason — it will break existing links to that page.

## Populations

Populations are **audience segments** that enable filtered views of resources. They represent specific communities or demographics.

### How Populations Work

When you tag a resource with a population, that resource appears on population-filtered pages. For example:

- A resource tagged with the "LGBTQ+ Community" population appears on `/lgbtq-community/`
- Combined category × population pages (like `/coping-strategies/lgbtq-community`) are **only generated when resources exist** for that combination — no empty pages are created

### Population Fields

| Field | Purpose |
|-------|---------|
| **Name** | The population name |
| **Slug** | URL segment for population-filtered pages |
| **Description** | Brief description of this population |
| **Underserved** | Flag indicating an underserved community (used for visibility) |
| **Image** | Cover image for the population |

### Population Pages on the Website

Population landing pages show a **pruned category tree** — only branches that actually contain resources for that population are displayed. This keeps navigation clean and avoids leading users to empty pages.

## How They Affect the Website

| Page Type | URL Pattern | What It Shows |
|-----------|-------------|---------------|
| Root category | `/topics/`, `/types-of-loss/`, `/supporting-the-bereaved/` | Subcategory summaries with resource counts |
| Category page | `/{category-slug}/` | Category info, featured resources, all tagged resources grouped by type |
| Population page | `/{population-slug}` | Pruned category tree showing only branches with resources for that population |
| Category × Population | `/{category-slug}/{population-slug}` | Resources filtered by both category and population |
| Root category × Population | `/topics/{population-slug}` | Filtered subcategory view |

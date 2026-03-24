---
title: Categories & Populations
order: 4
---

# Categories & Populations

Categories and populations are the two main ways content is organized on the website. Understanding how they work is essential, because they directly control which pages exist and what visitors see on them.

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

### Featured Resources

Each category can have up to **3 featured resources** that are displayed prominently on its page as a scrollable carousel. Keep in mind:

- Featured resources should have images — you'll see a warning if they don't
- Resources should already belong to the category (or one of its subcategories) to make sense as a featured item
- Featured placement is a key editorial tool for highlighting the best content

### Slugs and URLs

A category's slug becomes its URL segment. The category with slug `coping-strategies` produces the URL `/coping-strategies/`.

**Do not change slugs** on published categories without good reason — it will break existing links to that page.

## Populations

Populations are **audience segments** that enable filtered views of resources. They represent specific communities or demographics.

When you tag a resource with a population, that resource appears on population-filtered pages. For example, a resource tagged with the "LGBTQ+ Community" population appears on `/lgbtq-community/`.

### How Population Pages Look to Visitors

Population landing pages show a **pruned category tree** — only branches that actually contain resources for that population are displayed. This keeps navigation clean and avoids leading users to empty pages.

### Populations Can Create New Pages

Combined category x population pages (like `/coping-strategies/lgbtq-community`) are **only generated when resources exist** for that combination. This means that tagging a resource with both a category and a population may create a new page on the site that didn't exist before.

## How They Affect the Website

| Page Type             | URL Pattern                                                | What Visitors See                                                                                                  |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Root category         | `/topics/`, `/types-of-loss/`, `/supporting-the-bereaved/` | Subcategory summaries with resource counts                                                                         |
| Category page         | `/{category-slug}/`                                        | Category description, featured resources carousel, all tagged resources grouped by type with client-side filtering |
| Population page       | `/{population-slug}`                                       | Pruned category tree showing only branches with resources for that population                                      |
| Category x Population | `/{category-slug}/{population-slug}`                       | Resources filtered by both category and population, grouped by type                                                |
| Root x Population     | `/topics/{population-slug}`                                | Filtered subcategory view                                                                                          |

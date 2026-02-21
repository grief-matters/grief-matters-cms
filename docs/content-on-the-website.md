---
title: How Content Appears on the Website
order: 10
---

# How Content Appears on the Website

This page explains how the content you manage in the Studio maps to pages on whygriefmatters.org.

## The Big Picture

The website is **statically generated** — it's rebuilt from your CMS content at deploy time. There is no live data fetching. This means:

- Changes you make in the Studio appear on the website **after the next build/deploy**
- Publishing a document doesn't instantly update the website
- The site is fast and reliable because every page is pre-built HTML

## URL Patterns

| Page | URL | Content Source |
|------|-----|---------------|
| Homepage | `/` | Content Group with slug `home` + Organization branding |
| Topics | `/topics/` | Root category "Topics" — subcategory summaries with resource counts |
| Types of Loss | `/types-of-loss/` | Root category "Types of Loss" — subcategory summaries |
| Supporting the Bereaved | `/supporting-the-bereaved/` | Root category "Supporting the Bereaved" — subcategory summaries |
| Category page | `/{category-slug}/` | Individual category — info, featured resources, resources grouped by type |
| Population page | `/{population-slug}` | Population — pruned category tree with only relevant branches |
| Category × Population | `/{category-slug}/{population-slug}` | Resources matching both the category tree and population |
| Root × Population | `/topics/{population-slug}` | Filtered subcategory view for a population |
| Person page | `/about/{name}` | Person with a personal story |
| About / Team page | `/about/` | Person Groups and People |

## Key Behaviors

### Resources Bubble Up Through Categories

When you tag a resource with a subcategory, it automatically appears on all parent category pages too. Tag resources with the **most specific** category — they'll appear in broader categories automatically.

### Empty Pages Are Not Generated

Category × Population pages are only created when resources actually exist for that combination. If no resources match a particular category and population pair, no page is generated. This keeps the site clean and avoids dead-end pages.

### Population Pages Prune Empty Branches

Population landing pages show a filtered version of the category tree. Branches with no resources for that population are removed entirely, so users only see navigation paths that lead to actual content.

### Slugs Are URL Segments

Category and population slugs become part of the page URL. **Don't change slugs** on published content without good reason — it will break existing links, bookmarks, and search engine references to those pages.

### Featured Resources Appear Prominently

Resources you mark as "featured" on a category are displayed more prominently on that category's page. This is your main editorial tool for highlighting the best or most relevant content. Featured resources should have images for the best visual impact.

### Personal Stories Create Pages

Only people with a **Personal Story** field get their own page at `/about/{name}`. Everyone else appears on the team overview page but doesn't have a dedicated page.

### Content Groups Drive Page Content

Content Groups with specific slugs provide content for specific pages. The slug is the link between the CMS and the page — for example, the content group with slug `home` populates the homepage.

## Publishing Workflow

1. Create or edit content in the Studio
2. Review validation warnings and errors
3. Publish when ready
4. Content goes live after the next site deploy

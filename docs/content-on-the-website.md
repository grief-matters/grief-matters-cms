---
title: How Content Appears on the Website
order: 2
---

# How Content Appears on the Website

This page explains how the content you manage in the Studio maps to pages on whygriefmatters.org.

## The Big Picture

The website is **statically generated** — it's rebuilt from your CMS content at deploy time. There is no live data fetching. This means:

- Changes you make in the Studio appear on the website **after the next build/deploy**
- Publishing a document doesn't instantly update the website
- The site is fast and reliable because every page is pre-built HTML

## The Build Cycle

The website is rebuilt and deployed **every Monday at 7:00 AM UTC**. A manual build can also be triggered by via the **Website Management** tool.

In practice, this means:

- When you publish a change in the Studio, it won't appear on the website until the next build
- If you need an urgent change to go live before Monday, trigger a manual build via the **Website Management**
- You can safely make multiple changes throughout the week — they'll all go live together in the next build

## What Renders Where

Here's a high-level view of how different CMS documents feed into the website:

**Homepage** — The Content Group with slug `home` provides the hero image and page sections. The Organization document provides the logo and slogan that overlay the hero.

**Category pages** (e.g., `/coping-strategies/`) — The category's description appears at the top. Up to 3 featured resources display as a scrollable carousel. Below that, all resources tagged with the category (including those in subcategories) are listed, grouped by resource type. Visitors can filter by type using controls on the page.

**Root category pages** (`/topics/`, `/types-of-loss/`, `/supporting-the-bereaved/`) — Show summaries of each subcategory with resource counts, giving visitors an overview of what's available.

**Population pages** (e.g., `/lgbtq-community/`) — Show a pruned version of the category tree containing only branches that have resources for that population. This ensures every link leads somewhere useful.

**Category x Population pages** (e.g., `/coping-strategies/lgbtq-community`) — Show resources that match both the category and population, grouped by type. These pages are only generated when matching resources exist.

**About page** (`/about/`) — The Content Group with slug `about` provides the page header and content sections. Below that, team members from the core team Person Group are displayed with their avatars, roles, short bios, and social links. Members with a Personal Story get a "Read More" link to their dedicated page.

**Person pages** (`/about/{name}`) — Only generated for people who have a Personal Story. Shows their full personal narrative.

**Content Group pages** (e.g., `/donate`, `/about/mission-and-values`) — Pages driven entirely by Content Group content blocks. See [Building Pages](building-pages) for details on how these work.

## URL Patterns

| Page                    | URL                                  | Content Source                                                            |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| Homepage                | `/`                                  | Content Group with slug `home` + Organization branding                    |
| Topics                  | `/topics/`                           | Root category "Topics" — subcategory summaries with resource counts       |
| Types of Loss           | `/types-of-loss/`                    | Root category "Types of Loss" — subcategory summaries                     |
| Supporting the Bereaved | `/supporting-the-bereaved/`          | Root category "Supporting the Bereaved" — subcategory summaries           |
| Category page           | `/{category-slug}/`                  | Individual category — info, featured resources, resources grouped by type |
| Population page         | `/{population-slug}`                 | Population — pruned category tree with only relevant branches             |
| Category x Population   | `/{category-slug}/{population-slug}` | Resources matching both the category tree and population                  |
| Root x Population       | `/topics/{population-slug}`          | Filtered subcategory view for a population                                |
| Person page             | `/about/{name}`                      | Person with a personal story                                              |
| About / Team page       | `/about/`                            | Content Group with slug `about` + Person Groups                           |

## Key Behaviors

### Resources Bubble Up Through Categories

When you tag a resource with a subcategory, it automatically appears on all parent category pages too. Tag resources with the **most specific** category — they'll appear in broader categories automatically.

### Empty Pages Are Not Generated

Category x Population pages are only created when resources actually exist for that combination. If no resources match a particular category and population pair, no page is generated. This keeps the site clean and avoids dead-end pages.

### Population Pages Prune Empty Branches

Population landing pages show a filtered version of the category tree. Branches with no resources for that population are removed entirely, so users only see navigation paths that lead to actual content.

### Slugs Are URL Segments

Category and population slugs become part of the page URL. **Don't change slugs** on published content without good reason — it will break existing links, bookmarks, and search engine references to those pages.

### Featured Resources Appear Prominently

Resources you mark as "featured" on a category are displayed more prominently on that category's page as a scrollable carousel. This is your main editorial tool for highlighting the best or most relevant content. Featured resources should have images for the best visual impact (a fallback image will be used if one isn't specified).

### Personal Stories Create Pages

Only people with a **Personal Story** field get their own page at `/about/{name}`. Everyone else appears on the team overview page but doesn't have a dedicated page.

## Publishing Workflow

1. Create or edit content in the Studio
2. Review validation warnings and errors
3. Publish when ready
4. Content goes live after the next site build (Monday mornings, or when a manual build is triggered)

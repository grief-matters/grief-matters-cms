---
title: How Content Reaches the Site
order: 11
---

> TODO: Needs review

# How Content Reaches the Site

It helps to understand the journey your content takes from the Studio to
[whygriefmatters.org](https://whygriefmatters.org). You don't need the technical
detail — but a few facts about _how_ it works will save you confusion and prevent a
few common mistakes.

## Publishing is not the same as "going live"

The website is **statically generated**. That means the site isn't reading from
Sanity every time a visitor loads a page. Instead, on a schedule (or when someone
triggers it), a **build** runs: it reads all of your _published_ content out of
Sanity and turns it into a complete set of fixed web pages, which are then served to
visitors.

Two consequences follow, and they trip people up:

1. **Only published content is included.** Drafts are invisible to the build. If you
   want a change on the site, you must **publish** it — see **Adding & Editing a
   Resource**.
2. **Changes aren't instant.** Publishing updates the source of truth in Sanity, but
   the live site doesn't change until the _next build_ runs. So if you publish
   something and don't see it live immediately, that's expected — it'll appear after
   the next build. If a build seems overdue, ask a developer.

## Your tags build the pages

Most pages on the site aren't hand-made — they're **generated from resources and
their tags**. A category page is really "all the resources tagged this way,"
assembled at build time. This is why **Tagging & Classification** matters so much:
your tags don't just _describe_ resources, they _construct the site's pages_.

A few behaviours worth knowing:

- **Resources bubble up.** Tagging matters hierarchically — a resource tagged with a
  specific sub-topic also appears on the broader parent topic's page. You generally
  tag the _most specific_ thing and let it surface on the pages above it.
- **Empty combinations produce no page.** Pages that combine, say, a topic and a
  specific audience are **only created when resources actually exist** for that
  combination. Tagging resources for an underserved audience can therefore _bring a
  whole page into existence_ — and under-tagging can leave a gap where a page should
  be.

## Slugs are web addresses

A **slug** is the readable identifier that becomes part of a page's URL. Because a
slug _is_ the address:

- **Changing a slug changes the URL.** Any existing links to the old address —
  bookmarks, links from other sites, links you've shared — will break.
- Treat renaming a slug as seriously as changing a link. If a page is already live
  and linked, check with the team before changing its slug.

## What to do when something looks wrong on the live site

Work through this order before raising it:

1. **Is it published?** An unpublished draft won't appear. Publish it.
2. **Has a build run since you published?** New changes wait for the next build.
3. **Is it tagged correctly?** If a resource is missing from a page it should be on,
   the usual cause is a missing or incorrect tag — check its Classification.
4. **Still wrong after all that?** It may be a build or technical issue — raise it
   with a developer, noting what you changed and when.

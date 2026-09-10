---
title: Page Building
order: 10
---

# Page Building

Most of the site's pages — category and audience pages — are generated _automatically_ from resources and their tags. But some pages (like the home page or an About page) are **hand-built** from content you compose in the Studio. That's what this page is about.

> This is a more advanced, less frequent task than adding resources. If you are only tasked with reviewing resources, you can skip this page.

## The two building blocks: Content Groups and Content Blocks

Page building uses two document types that nest together:

- A **Content Group** is a _page_ (or a page-like region). It has a slug that ties it to an address on the site, and it holds an ordered list of Content Blocks.
- A **Content Block** is a _section_ within a page. It has a name (for your reference) and holds an ordered list of smaller **building blocks** — headings, text, images, featured resources, and so on.

Think of it as: **Content Group = the page**, **Content Blocks = sections on a page**, and the items inside each block = the content itself.

Both types have a **name** field that's purely for finding them inside the Studio — it is _not_ shown to visitors. Give them clear, recognisable names.

## What can go inside a Content Block

A Content Block's content is assembled from predefined building blocks. The main ones:

- **Heading Text** — a section heading.
- **Rich Text Content Block** — a body of formatted text.
- **Rich Text With Heading** — a heading plus a body of text together.
- **Image** (Image Asset reference) — a single image. See **Images & Accessibility**.
- **Image Row** — several images shown together.
- **Featured Resource / Featured Resources** — spotlight one or more resources from the directory, shown prominently.
- **Resource Links** — a list of external links.
- **Nav Item / Nav Items / Featured Nav Items / Static Nav Item** — navigation elements.
- **Person / Person Group** — a contributor or a group of people (used on team/About-style pages).

You can mix and combine these freely, in any order, to compose a section.

## Reuse and references

Content Blocks are created independently and are then reference within a Content Group. Whilst this can be confusing to get to grips with initially, it means that we can write content once and use it wherever we need to. Although practically speaking, most pages and their content are used in only in one place.

Because content blocks can be used in multiple places its important to remember that:

- Editing the underlying resource, image, or person updates it everywhere it's featured.
- Removing a resource that's featured somewhere will affect that page — check before deleting.

## Tips

- **Compose top to bottom.** Build the page as a reader will encounter it, section by section.
- **Name everything clearly.** "Home – hero", "Home – featured books" is preferred over something like "Content Block 1".
- **Slugs are addresses.** Changing a Content Group's slug could have ramifications — treat it as carefully as any other link. If in doubt, ask a developer.

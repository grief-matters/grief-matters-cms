---
title: Building Pages
order: 3
---

# Building Pages with Content Groups & Content Blocks

Content Groups and Content Blocks are the page-building system of the CMS. Understanding how they work together is key to composing pages on the website.

## The Page-Building Model

The system has three layers:

- **Content Group** = a page. Its slug links it to a specific URL on the website.
- **Content Block** = a section within a page. Each block is a reusable container of content items.
- **Content Items** = the individual building blocks (headings, text, images, links, featured resources, etc.) within each section.

A Content Group references one or more Content Blocks in a specific order. Each Content Block contains one or more content items. When the website is built, the page renders each block's content items in sequence — what you see in the Studio is what visitors get on the site.

### How Slugs Connect to Pages

The slug on a Content Group is the key connection between the CMS and the website. Some slugs link to pages that already exist on the site:

| Slug                 | Page                                           |
| -------------------- | ---------------------------------------------- |
| `home`               | Homepage (`/`)                                 |
| `about`              | About page (`/about`)                          |
| `mission-and-values` | Mission & Values (`/about/mission-and-values`) |
| `donate`             | Donate page (`/donate`)                        |

Presently, pages are created manually by developers, so do not create Content Groups without good reason or first speaking to a project developer.

### Content Blocks Are Reusable

A Content Block is its own document — it can be referenced by multiple Content Groups. This means you can create a block once (say, a "Get Involved" callout) and include it on several pages. Changes to the block will appear everywhere it's used.

## How Content Items Appear on the Website

Each content item type renders differently for visitors. Here's what each one looks like on the site:

### Text

- **Heading Text** — Renders as a centered section heading.
- **Rich Text** — Renders as formatted body text (bold, italic, links). When marked as "prominent," the text is displayed at a larger size to draw attention.
- **Rich Text With Heading** — Renders as a sub-heading followed by body text, kept together as a unit.

### Images

- **Accessible Image** — Renders as a responsive image that adapts to the visitor's screen size.
- **Image Row** — Renders as a grid of images. On mobile, only the first image is shown. On medium screens, the first two are shown. On large screens, up to three are visible. This means the order of images matters — put the most important one first.

### Featured Content

- **Featured Resource** — Renders as a single card showing the resource's image, title, and description. Apps render with store links, and websites render with their logo.
- **Featured Resources** — Renders as a horizontal, scrollable carousel of resource cards. Visitors can swipe or scroll through the collection.
- **Featured Website** — Renders as a single website card with its logo.
- **Featured Websites** — Renders as a grid of website cards (2 columns on mobile, 3 on larger screens).
- **Featured Crisis Resource** — _Not yet implemented on the website._ Content will not be visible to visitors.

### Links

- **Relative Link** — Renders as a simple text link to an internal page (the URL must start with `/`).
- **Resource Page Link** — Renders as a link to a filtered resource listing page. The filters you set (category, resource type, population) control which resources the visitor will see on that page.
- **Category Page Link** — Renders as a link to a category page. You can optionally set a custom label.
- **Page Links** — Renders as a collection of links. When "show images" is enabled, links appear as image cards in a grid (1 column on mobile, 2 on medium, 3 on large screens). Without images, links appear as a text list — marking them as "prominent" makes them more visually prominent.

### External Links

- **Resource Links** — _Not yet implemented on the website._ Content will not be visible to visitors.

## Practical Example: The Homepage

The homepage is built from a Content Group with the slug `home`. Here's how it works:

1. The Content Group's **image** is used as the full-width hero background at the top of the page.
2. Each **Content Block** referenced in the group becomes a section on the page, rendered in order.
3. The sections alternate between background color variants, creating visual separation.
4. Within each section, the content items render in sequence — a heading, then some text, then a featured resources carousel, for example.

So if the "home" Content Group references three Content Blocks, the homepage will have three sections below the hero image, each containing whatever content items those blocks hold.

## Tips

- Reorder content blocks within a group by dragging them — the order in the Studio is the order on the page.
- Content blocks are reusable across groups, but consider whether a shared block makes sense. If you want different content on different pages, create separate blocks.
- Keep an eye on unimplemented types (Featured Crisis Resource, Resource Links) — adding these to a block won't produce anything on the website yet.

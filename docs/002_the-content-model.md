---
title: The Content Model
order: 2
---

# The Content Model

> A content model defines structured types, fields, and relationships, enabling reusable, consistent content. It supports headless CMS workflows and scalable publishing across sites and apps.

To put another way, our **content model** gives us a concrete way to describe the content on our website as data. It allows us to define all of the different "shapes" that make up our content. In Sanity a "document" is essentially and instance of one of those shapes.

Sanity provide an [excellent explanation](https://www.sanity.io/glossary/content-model) for what a content model is and how it helps us build our website.

## Core principle

Almost everything on [whygriefmatters.org](https://whygriefmatters.org) is built around a single concept: a **resource**.

A resource is a carefully chosen link to something helpful that already exists elsewhere on the internet — an article, a book, a support group, a crisis line, a podcast, a video. We are not, for the most part, publishing our own writing. We are a **curated directory**: our value is in _finding_ good grief support, _describing_ it honestly, and _organising_ it so the right person can find it at the right moment.

Everything else in the content model exists to serve that idea — to describe resources, to classify them, or to arrange them into pages.

## Our content types

Our content types in the Studio fall into four categories. They appear in the Studio's left-hand list in roughly this order.

### Settings - one-off pieces of content

These are predefined, one-off documents (referred to as **singletons**). There's only ever _one_ of each type. You don't create or delete them; you only ever edit the single copy:

- **Organization** — site-wide branding: name, slogan, logos, mission, legal text.
- **Search Configuration** — settings that tune on-site search.

### Internet Resources — the core content types

This is the heart of the project and where you'll spend most of your time. Each
document is one external resource. There are many _types_ of resource e.g `Article`, `Book`, `Podcast`, `Support Group`, because a book and a crisis hotline need to be described differently and displayed differently.

They share a common backbone of fields (title, description, URL, image) and, most importantly, a shared set of **classification** fields — the tags that decide where each resource shows up on the site.

> See **Choosing a Resource Type** and **Adding & Editing a Resource**.

### Classification — the resource taxonomy

These documents _are the taxonomy_. They're the controlled vocabulary you pick from when you classify a resource:

- **Loss Relationship** — who or what was lost (a parent, a spouse, a pet)
- **Cause of Death** — how the death happened (cancer, suicide, sudden/traumatic)
- **Grief Type** — the kind of grief (anticipatory, complicated, disenfranchised…)
- **Grief Phase** — where in the grief arc a resource speaks to
- **Emotional State** — feelings a resource addresses (anger, guilt, numbness…)
- **Theme** — subject matter (self-care, funerals & memorials, continuing bonds…)
- **Demographic** — a specific community a resource is made for
- **Content Function** — what the reader is trying to _do_ (get practical help, feel validated, build a skill…)

You don't tag by typing free text — you tag by _referencing_ one of these documents.

> See **Tagging & Classification**. Note: the _scope_ of these classifications — what each one is really for — is an editorial decision. If you're unsure where a boundary lies, speak to the project's editorial lead

### Page-building documents

These can be thought of as additional building blocks that we can use to put together engaging pages on the website:

- **Content Group** / **Content Block** — the page builder. A Content Group is a page (or a page-like section); it's made of ordered Content Blocks, each of which is a section built from smaller pieces (headings, rich text, images, featured resources).
- **Navigation Tree** — the site menus.
- **Person** / **Person Group** — team and contributor profiles (e.g. the About page).
- **Image Asset** / **Image Collection** / **Image Source** — reusable images and their attribution.
- **Form**, **Endorsement**, and a few others — supporting content.

> See **Page Building**.

## How the pieces connect

The relationships between documents are what make this a _model_ and not just a pile of data. There two most important things to remember in this regard are:

- **References** — when a resource is tagged with the "Loss of a Parent" loss relationship, it holds a _reference_ to that Loss Relationship document. The same is true for a Content Group pointing at its Content Blocks, or a Person Group listing its members. References are how documents reuse each other instead of duplicating.
- **The taxonomy drives the pages** - this is the single most important consequence of the model for you as an editor: _the classifications you apply to a resource determine which pages it appears on._ A page for "grief after suicide" is, under the hood, "every resource tagged with the _suicide_ cause of death." If a resource isn't tagged, it effectively doesn't exist to the people who need it. This is why good judgement is essential in the editorial process.

## How this maps to the live site

The site is **statically generated**: at build time, the project reads all the published content out of Sanity and turns it into a set of fixed web pages. There's no live database call when a visitor loads a page. As such its important to remember that **changes aren't instant.** Publishing in the Studio doesn't immediately change the live site — a build has to run first.

> See **How Content Reaches the Site** for the full picture.

## Where to go next

- Start with **Choosing a Resource Type** and **Adding & Editing a Resource**.
- Want to understand the part that matters most editorially? Read **Tagging & Classification**.

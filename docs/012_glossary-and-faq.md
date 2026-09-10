---
title: Glossary & FAQ
order: 12
---

> TODO: Needs review

# Glossary & FAQ

A quick reference for the terms and questions that come up most often.

## Glossary

### Sanity & Studio terms

**Studio** — the content-editing application you're using right now. It's the admin interface to the project's content.

**Document** — a single piece of content: one resource, one taxonomy, one page. Every document has a **type**.

**Type** — the "shape" of a document (`Article`, `Book`, `Theme`, `Content Group`…). The type decides which fields a document has. See **The Content Model**. The shape can also be referred to as the **schema**

**Field** — a single input on a document (its title, description, URL…).

**Group** — a tab that organises a document's fields (e.g. _Resource Attributes_, _Classification_). See **Adding & Editing a Resource**.

**Draft** — an unpublished, in-progress version of a document. Saved automatically, but **not live**. See **Adding & Editing a Resource**.

**Published** — the version of a document that the site build will pick up. You make a draft live by **publishing** it.

**Reference** — a link from one document to another (a resource _references_ its classifications; a Content Group _references_ its Content Blocks). References let documents reuse each other instead of duplicating content.

**Singleton** — a document there's only one of, which you edit rather than create/delete (e.g. **Organization**, **Search Configuration**).

**Slug** — the readable identifier that becomes part of a page's web address. Changing a slug changes the URL. See **How Content Reaches the Site**.

**Portable Text / Rich Text** — formatted text (bold, italics, lists, links), as opposed to the plain-text fields used for resource descriptions.

**Static generation / build** — the process that turns your published content into the fixed pages served to visitors. Changes go live at the _next build_, not the instant you publish.

### Project terms

**Resource / Internet Resource** — a curated link to something helpful elsewhere on the web. The core content of the site. See **Choosing a Resource Type**.

**Classification / taxonomy** — the controlled set of tags (Theme, Grief Type, Emotional State…) you apply to resources to decide where they appear. See **Tagging & Classification**.

**AI Content Editor** — the automated assistant that reviews resources and proposes draft changes and quality scores for a human to approve. See **AI Assist Features**.

**AI Prompt Hint** — the short note on each tag that tells the AI Content Editor when to use that tag. The _only_ per-tag steering the AI gets. Owned editorially.

**External Org** — the resource type for an organisation; also what you pick in a resource's **Source** field.

**Featured** — a resource deliberately spotlighted on a page. Featured resources usually show their image.

## FAQ

**I published a change but I don't see it on the live site.**

_The site updates at the next build, not instantly. Confirm the document is published (not just drafted), then wait for the next build. If it's clearly overdue, ask a developer. See **How Content Reaches the Site**._

**A resource is missing from a page it should be on.**

_Almost always a tagging issue. Open the resource, check its **Classification**, and confirm it has the tags that build that page. See **Tagging & Classification**._

**Which resource type should I use for X?**

_See **Choosing a Resource Type**, especially the section on commonly confused pairs. If nothing fits, don't force it — flag it._

**The AI suggested a change / score I disagree with.**

_Your judgement wins. The AI only proposes; you approve, amend, or discard. Change the quality score if you disagree. See **AI Assist Features**_

**Do I need to fill in every field?**

_No — only the required ones (marked, and enforced before publishing). Fill in the optional fields where they genuinely add value. Warnings (yellow) are advice, not blocks._

**Can I change a tag's name or its AI hint?**

_Tag scope and hint wording are owned by the editorial lead, because they define what a tag means across the whole site. Report issues for editorial review rather than editing hints yourself. See **Tagging & Classification** and **AI Assist Features**._

**I think a field or type is wrong / missing.**

_The content model is owned by the developers. Flag it rather than working around it._

**Who do I ask about…?**

- _What a tag means / where a boundary lies_ → the editorial lead.
- _A missing field or type, a build problem, a slug change_ → a developer.

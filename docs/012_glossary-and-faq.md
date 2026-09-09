---
title: Glossary & FAQ
order: 12
---

> TODO: Needs review

# Glossary & FAQ

A quick reference for the terms and questions that come up most often.

## Glossary

### Sanity & Studio terms

**Studio** — the content-editing application you're using right now. It's the admin
interface to the project's content.

**Document** — a single piece of content: one resource, one tag, one page. Every
document has a **type**.

**Type** — the "shape" of a document (`Article`, `Book`, `Theme`, `Content
Group`…). The type decides which fields a document has. See **The Content Model**.

**Field** — a single input on a document (its title, description, URL…).

**Group** — a tab that organises a document's fields (e.g. _Resource Attributes_,
_Classification_). See **Adding & Editing a Resource**.

**Draft** — an unpublished, in-progress version of a document. Saved automatically,
but **not live**. See **Adding & Editing a Resource**.

**Published** — the version of a document that the site build will pick up. You make
a draft live by **publishing** it.

**Reference** — a link from one document to another (a resource _references_ its
tags; a Content Group _references_ its Content Blocks). References let documents
reuse each other instead of duplicating content.

**Singleton** — a document there's only one of, which you edit rather than
create/delete (e.g. **Organization**, **Search Configuration**).

**Slug** — the readable identifier that becomes part of a page's web address.
Changing a slug changes the URL. See **How Content Reaches the Site**.

**Portable Text / Rich Text** — formatted text (bold, italics, lists, links), as
opposed to the plain-text fields used for resource descriptions.

**Static generation / build** — the process that turns your published content into
the fixed pages served to visitors. Changes go live at the _next build_, not the
instant you publish.

### Project terms

**Resource / Internet Resource** — a curated link to something helpful elsewhere on
the web. The core content of the site. See **Choosing a Resource Type**.

**Classification / taxonomy** — the controlled set of tags (Theme, Grief Type,
Emotional State…) you apply to resources to decide where they appear. See **Tagging
& Classification**.

**AI Content Editor** — the automated assistant that reviews resources and proposes
draft changes and quality scores for a human to approve. See **AI Assist Features**.

**AI Prompt Hint** — the short note on each tag that tells the AI Content Editor when
to use that tag. The _only_ per-tag steering the AI gets. Owned editorially.

**External Org** — the resource type for an organisation; also what you pick in a
resource's **Source** field.

**Featured** — a resource deliberately spotlighted on a page. Featured resources
usually show their image.

### Grief terms you'll meet in the taxonomy

**Anticipatory grief** — grief that begins _before_ a death, e.g. during a terminal
illness.

**Complicated grief** — grief that is unusually prolonged or disabling.

**Disenfranchised grief** — grief that isn't openly acknowledged or socially
supported (e.g. the loss of an ex-partner, a pet, or a pregnancy).

**Continuing bonds** — the idea that a healthy grief can include an ongoing,
changed relationship with the person who died, rather than "moving on" from them.

> The precise scope of these terms _as tags on this project_ is an editorial
> decision. When a boundary is unclear, raise it — don't guess. See **Tagging &
> Classification**.

## FAQ

**I published a change but I don't see it on the live site.**
The site updates at the next build, not instantly. Confirm the document is published
(not just drafted), then wait for the next build. If it's clearly overdue, ask a
developer. See **How Content Reaches the Site**.

**A resource is missing from a page it should be on.**
Almost always a tagging issue. Open the resource, check its **Classification**, and
confirm it has the tags that build that page. See **Tagging & Classification**.

**Which resource type should I use for X?**
See **Choosing a Resource Type**, especially the section on commonly confused pairs.
If nothing fits, don't force it — flag it.

**The AI suggested a change / score I disagree with.**
Your judgement wins. The AI only _proposes_; you approve, amend, or discard. Change
the quality score if you disagree. See **AI Assist Features**.

**Do I need to fill in every field?**
No — only the required ones (marked, and enforced before publishing). Fill in the
optional fields where they genuinely add value. Warnings (yellow) are advice, not
blocks.

**Can I change a tag's name or its AI hint?**
Tag _scope_ and _hint wording_ are owned by the editorial lead, because they define
what a tag means across the whole site. Report issues for editorial review rather
than editing hints yourself. See **Tagging & Classification** and **AI Assist
Features**.

**I think a field or type is wrong / missing.**
The content model is owned by the developers. Flag it rather than working around it.

**Who do I ask about…?**

- _What a tag means / where a boundary lies_ → the editorial lead.
- _A missing field or type, a build problem, a slug change_ → a developer.

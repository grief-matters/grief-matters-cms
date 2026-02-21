---
title: Glossary
order: 2
---

# Glossary

Key terms you'll encounter when working in the Studio.

## Document

A single content record in the CMS. For example, one article, one category, or one person is each a document.

## Schema / Document Type

The template that defines what fields a document has. "Article" is a document type; each individual article you create is a document of that type.

## Draft / Published

Every document has two possible states:

- **Draft** — Work in progress. Only visible inside the Studio. Shown with an orange indicator.
- **Published** — Live content that appears on the website (after the next site build). Shown with a green indicator.

You can edit a published document — this creates a new draft on top of the published version. The published version stays live until you publish the draft.

## Slug

A URL-friendly identifier automatically generated from a title or name. Slugs become part of the page URL on the website. For example, a category titled "Coping with Loss" gets the slug `coping-with-loss`, producing a URL like `whygriefmatters.org/coping-with-loss/`.

**Important:** Changing a slug after publishing changes the URL, which breaks any existing links to that page.

## Reference

A link from one document to another within the CMS. For example, when you assign categories to a resource, you're creating references from the resource to those category documents.

## Portable Text

Sanity's rich text editor. It works like a simplified word processor — you can add bold, italic, underline, strikethrough, and links. Content is stored as structured data, not raw HTML.

## Singleton

A document type that has exactly one instance. The Organization document is a singleton — you can edit it but cannot create a second one or delete it.

## Hotspot

The focal point you set on an image so it crops well at different sizes. When you upload an image, you can click to set the hotspot. The website uses this to ensure the important part of the image stays visible regardless of how it's cropped.

## Validation

Rules that check your content before publishing:

- **Errors** (red) — Must be fixed before you can publish
- **Warnings** (yellow) — Advisory suggestions that don't block publishing

Common validations include required fields, character length recommendations, and format checks.

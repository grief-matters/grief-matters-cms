# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sanity Studio CMS for the "Why Grief Matters" nonprofit (whygriefmatters.org). Two main parts:
- **Sanity Studio** — Content management UI for grief support resources
- **Cloudflare Worker** — Serverless API for deployment management (`worker/`)

## Commands

- `npm run dev` — Start Sanity Studio dev server (localhost:3333)
- `npm run worker-dev` — Build and test Cloudflare Worker locally (localhost:8787)
- `npm run build` — Production build (`wrangler types && sanity build`)
- `npm run start` — Production start

No test framework is configured. Linting uses ESLint with `@sanity/eslint-config-studio`. Prettier uses defaults.

## Architecture

### Schema System (schemas/)

Three tiers of Sanity schema definitions:

- **`documentSchemas/`** — 16 top-level document types (category, contentBlock, crisisResource, organization, person, etc.)
- **`internetResourceDocumentSchemas/`** — 17 internet resource types (app, article, blog, book, podcast, video, etc.) that all extend `createBaseInternetResourceSchema()` from `helpers.ts`
- **`objectSchemas/`** — 28 reusable nested object types (links, content blocks, collections, contact methods)
- **`fields/`** — Shared field definitions reused across schemas (titleField, slugField, categoriesField, ratingField, etc.)

### Key Patterns

**Internet Resource Factory:** All internet resource types share a base schema created by `createBaseInternetResourceSchema()` in `schemas/helpers.ts`. Each type adds specialized fields on top. The `ConvertAction` (`actions/convertAction.tsx`) allows converting between resource types.

**Singleton Pattern:** The `organization` document is a singleton with restricted actions (no create/delete) configured in `sanity.config.ts`.

**Internet Resource Type Constants:** All resource type names are defined as a readonly array in `constants.ts` with a corresponding `InternetResourceType` type. Each type maps to either "name" or "title" as its naming field.

**Type-Safe Routing:** Worker routes defined in `shared/routes.ts` using a `createRoute()` helper that enforces required params at the type level.

### Studio Customization

- **`structure/`** — Sidebar navigation organization (singletons, documents, internet resources)
- **`components/`** — Custom React input/preview components (RatingInput, TimeInput, ResourceUrlInput, etc.)
- **`configs/`** — Preview configurations for complex objects
- **`tools/website-tools/`** — Custom plugin for website deployment management UI
- **`dashboard-widgets/`** — Resource type overview and category tree widgets

### Environment

- `.env` — Sanity Studio vars (project ID, dataset, API version, API base URL)
- `.dev.vars` — Cloudflare Worker credentials (not committed)
- `wrangler.toml` — Worker config with production/dev environment split
- Node 24.13.0 (`.nvmrc`)

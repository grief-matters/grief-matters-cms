# Why Grief Matters CMS

The content management system for the [Why Grief Matters](https://www.whygriefmatters.org) nonprofit. This monorepo contains two main parts:

- **Sanity Studio** — Content management UI for curating grief support resources
- **Cloudflare Worker** — Serves the Studio as a single-page application and exposes API routes for deployment management and link checking

If you have lost someone and are looking for support, or you're supporting someone else, please visit [whygriefmatters.org](https://www.whygriefmatters.org).

## Table of Contents

- [Quick Start](#quick-start)
- [Contributing](#contributing)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development](#development)
- [Data Migrations](#data-migrations)
- [Code Quality](#code-quality)
- [CI/CD](#cicd)
- [Additional Resources](#additional-resources)

## Quick Start

### Prerequisites

- Node 24.13.0 (see `.nvmrc`)
- npm
- A Sanity account with access to the project (see [Contributing](#contributing))

### Setup

1. Clone the repo
   ```sh
   git clone https://github.com/grief-matters/grief-matters-cms.git
   cd grief-matters-cms
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root:
   ```shell
   SANITY_STUDIO_PROJECT_ID="<project-id>"
   SANITY_STUDIO_DATASET="dev"
   SANITY_STUDIO_API_VERSION="2023-07-16"
   SANITY_STUDIO_API_BASE_URL="http://localhost:8787"
   ```
   The Sanity project has a public API — these values are not secrets. You'll receive the project ID when granted access.
4. Create a `.dev.vars` file in the project root:
   ```shell
   CF_API_TOKEN="<cloudflare-api-token>"
   CF_ACCOUNT_ID="<cloudflare-account-id>"
   WEBSITE_DEPLOY_HOOK="<deploy-hook-url>"
   SANITY_STUDIO_DATASET="dev"
   ```
   `CF_API_TOKEN` and `CF_ACCOUNT_ID` are secrets — get these from the project team. `WEBSITE_DEPLOY_HOOK` can be left empty for local development.
5. Start the Studio dev server:
   ```sh
   npm run dev
   ```
6. Open http://localhost:3333 (you'll be prompted to authenticate with Sanity on first run).

## Contributing

We welcome contributions of all sizes and skill levels. See the [Contributing guide](./CONTRIBUTING.md) for details on getting access and getting started.

**Contribution workflows:**

- **Direct access** — Long-term contributors clone the repo and work on branches directly.
- **Fork and pull** — One-off contributors [fork the repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo), make changes, and open a pull request.

GitHub issue templates are available for [features, enhancements, bugs, and devops](.github/ISSUE_TEMPLATE/).

## Project Structure

```
├── actions/            # Custom Sanity document actions (e.g. ConvertAction)
├── components/         # Custom React input/preview components
├── configs/            # Preview configurations for complex objects
├── constants.ts        # Internet resource type constants
├── dashboard-widgets/  # Sanity dashboard widgets
├── migrations/         # Sanity content migrations
├── schemas/
│   ├── documentSchemas/                # Top-level document types
│   ├── internetResourceDocumentSchemas/ # Internet resource types (extend base schema)
│   ├── objectSchemas/                  # Reusable nested object types
│   ├── fields/                         # Shared field definitions
│   ├── helpers.ts                      # Factory functions (createBaseInternetResourceSchema)
│   └── index.ts                        # Schema exports
├── shared/             # Code shared between Studio and Worker
│   ├── routes.ts       # Type-safe API route definitions
│   └── types/          # Shared TypeScript types
├── structure/          # Sidebar navigation organization
├── tools/
│   ├── api-client/     # API client for Worker endpoints
│   └── website-tools/  # Website management Studio plugin
├── worker/             # Cloudflare Worker source
│   ├── index.ts        # Worker entry point and router
│   ├── handlers/       # Route handlers
│   ├── mock-server.ts  # Mock API server for local Studio development
│   └── utils/          # Cloudflare and Sanity client utilities
├── sanity.config.ts    # Studio configuration
├── sanity.cli.ts       # Sanity CLI configuration
├── wrangler.toml       # Cloudflare Worker configuration
└── tsconfig.json       # TypeScript configuration
```

## Architecture

### Sanity Studio

The Studio is the content management UI where editors curate grief support resources. It is configured in `sanity.config.ts` and built around a three-tier schema system:

- **Document schemas** (`schemas/documentSchemas/`) — Top-level document types like `category`, `contentBlock`, `crisisResource`, `organization`, `person`, `website`, etc.
- **Internet resource schemas** (`schemas/internetResourceDocumentSchemas/`) — 17 resource types (app, article, blog, book, community, course, forum, memorial, podcast, story, video, etc.) that all extend a base schema created by `createBaseInternetResourceSchema()` in `schemas/helpers.ts`. Each type adds specialized fields on top of the shared base.
- **Object schemas** (`schemas/objectSchemas/`) — Reusable nested types (links, content blocks, collections, contact methods).
- **Shared fields** (`schemas/fields/`) — Field definitions reused across schemas (titleField, slugField, categoriesField, ratingField, etc.).

**Key patterns:**

- **Internet resource factory** — All internet resource types share a base schema. The `ConvertAction` (`actions/convertAction.tsx`) allows converting documents between resource types.
- **Singleton pattern** — The `organization` document type is a singleton with restricted actions (no create/delete).
- **Custom components** — `components/` contains custom input and preview components (RatingInput, TimeInput, ResourceUrlInput, etc.).
- **Dashboard widgets** — Resource type overview and category tree widgets on the Studio dashboard.
- **Structure customization** — `structure/` defines the sidebar navigation layout (singletons, document groups, internet resources).

### Cloudflare Worker

The Worker (`worker/index.ts`) serves the built Studio as a single-page application and provides API endpoints using [itty-router](https://github.com/kwhitley/itty-router).

**API routes** (defined in `shared/routes.ts`):

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/deployments` | Trigger a website deployment |
| `GET` | `/api/deployments` | List deployments |
| `GET` | `/api/deployments/latest` | Get the latest deployment |
| `GET` | `/api/deployments/:deploymentId` | Get a specific deployment |
| `GET` | `/api/broken-links` | Get broken link check results |

**Scheduled tasks:**

- A broken link checker runs on a cron schedule (`0 3 * * 1` — weekly at 3am UTC on Mondays). It checks resource URLs via the Sanity client and stores results in Cloudflare KV (`WGM_BROKEN_LINKS` binding).

**KV bindings:**

- `WGM_BROKEN_LINKS` — Stores broken link check results.

### Shared Code

The `shared/` directory contains code used by both the Studio and the Worker:

- `shared/routes.ts` — API route definitions with a type-safe `createRoute()` helper that enforces required parameters at the type level.
- `shared/types/` — Shared TypeScript types (e.g. `broken-links.ts`).

## Development

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Generate Wrangler types, then start Sanity Studio dev server (localhost:3333) |
| `worker-dev` | `npm run worker-dev` | Build the Studio, then start the Worker locally with Wrangler (localhost:8787) |
| `build` | `npm run build` | Generate Wrangler types, then production build the Studio |
| `start` | `npm run start` | Generate Wrangler types, then start Sanity in production mode |
| `mock-api` | `npm run mock-api` | Start mock API server for Studio development (`npx tsx worker/mock-server.ts`) |

### Environment Variables

**`.env`** (Sanity Studio — not secrets):

| Variable | Description |
|----------|-------------|
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID |
| `SANITY_STUDIO_DATASET` | Dataset name (`dev` for local development) |
| `SANITY_STUDIO_API_VERSION` | Sanity API version date |
| `SANITY_STUDIO_API_BASE_URL` | Base URL for the Worker API (use `http://localhost:8787` locally) |

**`.dev.vars`** (Cloudflare Worker — contains secrets):

| Variable | Secret? | Description |
|----------|---------|-------------|
| `CF_API_TOKEN` | Yes | Cloudflare API token |
| `CF_ACCOUNT_ID` | Yes | Cloudflare account ID |
| `WEBSITE_DEPLOY_HOOK` | Yes | Webhook URL to trigger website deployments |
| `SANITY_STUDIO_DATASET` | No | Dataset name (must match `.env`) |

### Working on the Studio

- Schemas are organized into three tiers under `schemas/` (see [Architecture](#sanity-studio)).
- To add a new internet resource type: create a file in `schemas/internetResourceDocumentSchemas/` using `createBaseInternetResourceSchema()`, add the type name to `INTERNET_RESOURCE_TYPES` in `constants.ts`, and export it from `schemas/index.ts`.
- Key files: `sanity.config.ts` (plugins, schema, document actions), `structure/index.ts` (sidebar layout), `components/` (custom inputs/previews).

### Working on the Worker

- Entry point: `worker/index.ts` — sets up the itty-router and exports `fetch` and `scheduled` handlers.
- Route handlers live in `worker/handlers/` with one file per handler group.
- API routes are defined in `shared/routes.ts` — add new routes there so both the Studio tools and Worker can reference them.
- Utility clients: `worker/utils/cf-builds-client.ts` (Cloudflare Pages builds API), `worker/utils/sanity-client.ts` (Sanity API), `worker/utils/url-checker.ts` (link checking).
- Local development: `npm run worker-dev` builds the Studio and starts Wrangler's local dev server at http://localhost:8787.

### Working on Studio Tools and Plugins

- **Website Management tool** (`tools/website-tools/`) — Custom Studio plugin for managing website deployments and viewing broken link reports. Registered in `sanity.config.ts`.
- **API client** (`tools/api-client/`) — Shared client used by Studio tools to call Worker API endpoints.
- **Dashboard widgets** (`dashboard-widgets/`) — Resource type overview and category tree widgets displayed on the Studio dashboard.

## Data Migrations

Sanity content migrations live in `migrations/`. Each migration is a directory containing an `index.ts` file.

Run migrations using the Sanity CLI:

```sh
npx sanity migration run <migration-name> --project <project-id> --dataset <dataset>
```

Use the `--dry` flag to preview changes before applying.

## Code Quality

- **ESLint** — Configured with `@sanity/eslint-config-studio`
- **Prettier** — Using default configuration
- **TypeScript** — Strict mode enabled
- No test framework is currently configured

## CI/CD

**Sync Production to Dev** (`.github/workflows/prepare-datasets.yml`)

Automatically triggered when a new branch is created (or manually via workflow dispatch). Exports the `production` Sanity dataset, deletes and recreates the `dev` dataset, then imports the production data. This ensures developers always work against fresh production content.

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Why Grief Matters Website](https://www.whygriefmatters.org)

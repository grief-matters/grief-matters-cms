# Contributing

The Why Grief Matters project is made possible by a group of dedicated volunteers. We welcome contributions of all sizes and skill levels, and we also welcome enquiries from those wanting to work on the project over the long term.

**Questions?** Reach out to Dan Chambers (technical lead) at dan@whygriefmatters.org.

> [!Tip]
>
> If you're new to contributing to open source on GitHub, check out [first-contributions](https://github.com/firstcontributions/first-contributions) for a gentle introduction.

## Prerequisites

- **Node.js** — install the version specified in `.nvmrc` (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** — comes with Node.js

## Getting Started

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   nvm use
   npm install
   ```
3. Copy the environment templates:
   ```bash
   cp .env.example .env
   cp .dev.vars.example .dev.vars
   ```
4. Fill in the secret values (see below)
5. Start the Sanity Studio dev server:
   ```bash
   npm run dev
   ```
   The studio will be available at `http://localhost:3333`.

## Requesting Access

This project uses Sanity Studio to manage content. To contribute you'll need:

- **Sanity Studio access** — to view and edit content in the CMS
- **API tokens** — for `SANITY_API_AUTH_TOKEN` and Cloudflare Worker secrets

Contact Dan Chambers at dan@whygriefmatters.org to request access. Please include your GitHub username.

## Git Workflow

1. Create a branch from `main` using a descriptive prefix:
   - `feature/` — new features
   - `fix/` — bug fixes
   - `docs/` — documentation changes
2. Make your changes in small, focused commits
3. Before opening a PR, make sure all checks pass:
   ```bash
   npm run lint
   npm run format:check
   npm run typecheck
   ```
4. Open a pull request against `main` and fill out the PR template

## Finding Work

- Check the [issue tracker](https://github.com/grief-matters/grief-matters-cms/issues) for open issues
- Issues labeled **`good first issue`** are great starting points for new contributors
- If you'd like to work on something not listed, open an issue first to discuss it

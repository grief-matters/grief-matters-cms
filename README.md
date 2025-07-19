# Why Grief Matters CMS

Welcome to the Why Grief Matters Sanity Studio! This repository plays host to the content management system(CMS) that backs the Why Grief Matters project.

If you have lost someone and are looking for support, or you're supporting someone else, please visit the website; [https://www.whygriefmatters.org](www.whygriefmatters.org).

---

## Contributing

We welcome contributions of all sizes and skill levels. There are a couple of different ways we accept contributions, and in all cases you'll need permission to access our Sanity Project. See the [Contributing](./CONTRIBUTING.md) guide for more information.

---

[TODO] Review all of this now we've migrated to Cloudflare Workers

## Quick Start Guide

1. Create a Sanity account and join our Sanity Org
2. Clone this repo `git clone https://github.com/grief-matters/grief-matters-cms.git`
3. `cd` into the project
4. Create a file named `.env` in the root of your project and add to it the following environment variables:
   ```shell
   SANITY_STUDIO_PROJECT_ID="PROJECT_ID" #replace with the actual ID
   SANITY_STUDIO_DATASET="dev"
   SANITY_STUDIO_API_VERSION="2023-07-16"
   ```
   Our Sanity project has a public API - so these environment variables do not need to be treated as secrets.
5. Create a file named `.dev.vars` in the root of your project and add the following variables:
   ```shell
   WEBSITE_DEPLOY_HOOK="" # not needed in local development
   SANITY_STUDIO_DATASET="dev"
   ```
   These variables are required for local development.
6. Run `npm install` at the root of the project to install all dependencies.
7. Run `npm run dev` at the root of the project folder. This will build the studio application and start a local development server (you'll be prompted to authenticate with your Sanity credentials).
8. Once the build is complete, you can head over to http://localhost:3333.

---

More detailed information for developers working on the project can be found in [docs](./docs/README.md)

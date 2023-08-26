# Why Grief Matters Sanity Studio

Welcome to the Why Grief Matters Sanity Studio! This repository plays host to the content management system(CMS) that backs the Why Grief Matters project.

If you have lost someone and are looking for support, or you're supporting someone else, please visit the website; [https://www.whygriefmatters.org](www.whygriefmatters.org).

## About Sanity Studio

Sanity Studio offers an intuitive interface for real-time editing. Collaborative and efficient, it ensures data consistency and accuracy, allowing creators to effortlessly craft, edit, and organize content. Sanity Studio optimizes productivity and enhances the content creation journey.

## Getting Started (Content Editors)

If you're a content editor looking to dive into how to use the system, please refer to the comprehensive documentation available [here](./docs/index.md). This guide offers step-by-step instructions and insights tailored specifically for content creators. Get ready to unlock the full potential of our content management system!

## Getting Started (Developers)

If you're a developer looking to get started. Read on!

First, you'll need permission to connect to the Sanity Content Lake. First, get permission to work on the project from either Dan Chambers or Dr. Camille Wortman. Next, you'll need to create and account over at [Sanity.io](https://sanity.io) and provide your account details to Dan.

Once you're all set up with an account, follow these steps to get started:

1. Clone this repo `git clone https://github.com/grief-matters/grief-matters-cms.git`
2. `cd` into the project
3. Create a file named `.env` in the root of your project and add to it the following environment variables:
   ```
   SANITY_STUDIO_DATASET="dev"
   SANITY_STUDIO_API_VERSION="2023-07-16"
   ```
4. Run `npm run dev` in the project folder. This will build the studio application and start a local development server.
5. Once the build is complete, you can head over to http://localhost:3333.

   > Note: when you run the server for the first time, you'll be asked to authenticate to Sanity.io

You should now see the Sanity Studio running in your browser!

As you modify and save the code, the server will automatically rebuild the studio and refresh the browser.

You can stop your development server by pressing `Ctrl-C` in the terminal where the server is running.

Once you're up and running head over to the [Sanity docs](https://www.sanity.io/docs) for info on how to develop the Studio.

## Deployment

We use [Netlify](https://netlify.com) to deploy our Sanity Studio. Each deployment is connected to a [dataset](https://www.sanity.io/docs/datasets) in the Content Lake. We currently have two datasets; `production` and `dev`. As you would expect, our **production** deployment is connected to the **"production"** dataset. All other deployments are connected to our **"dev"** dataset.

The **"dev"** dataset is currently manually created on a semi-regular basis from our **"production"** dataset.

### Production

Our **"production"** instance of Sanity Studio is currently deployed to: [https://grief-matters-sanity-studio.netlify.app/](https://grief-matters-sanity-studio.netlify.app/)

> Note: Only authorised users can log in to the Studio

[![Netlify Status](https://api.netlify.com/api/v1/badges/f66273ec-f841-4661-852f-3fa281fbdee4/deploy-status)](https://app.netlify.com/sites/grief-matters-sanity-studio/deploys)

### Development

We utilise Netlify's [Branch Deploy](https://docs.netlify.com/site-deploys/overview/#branches-and-deploys) feature during development. When you create a new branch it will automatically be deployed to Netlify. This is useful when demonstrating a feature you're working on.

The format for the deployment URL is `https://branch-name--grief-matters-sanity-studio.netlify.app`. So if you checkout a branch called `my-awesome-feature`, when you push to the branch you'll see you're changes at `https://my-awesome-feature--grief-matters-sanity-studio.netlify.app`.

### Sandbox

We also have a **"Sandbox"** deployment, deployed via the `sandbox` branch. Presently `main` is semi-regularly merged into the `sandbox` branch, but we hope to have this happen automatically soon!

The deployment for the `sandbox` can be found at [https://grief-matters-sanity-studio.netlify.app](https://grief-matters-sanity-studio.netlify.app)

---

## Wanting to Contribute?

We welcome contributions from the community! If you'd like to contribute to Why Grief Matters, please contact Dan Chambers or Dr. Camille Wortman.

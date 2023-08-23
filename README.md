# Why Grief Matters CMS

This repository holds the code for Sanity Content Studio, an open source real-time content editing environment connected to the Sanity backend (or Content Lake).

## Getting Started (Content Editors)

To get started with Sanity Studio please see the [docs](./docs/index.md)

## Environments

Our Sanity Studio is currently deployed to the following environments

### Production

Our production Sanity Studio is deployed automatically when a push is made to the `main` branch, usually via a pull request. It is connected to our "production" dataset:

**Production URL**: https://grief-matters-sanity-studio.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/f66273ec-f841-4661-852f-3fa281fbdee4/deploy-status)](https://app.netlify.com/sites/grief-matters-sanity-studio/deploys)

### Development

We are currently using Netlify's [Branch Deploy](https://docs.netlify.com/site-deploys/overview/#branches-and-deploys) feature.

This means that if you create the branch `my-awesome-feature` it will deploy on Netlify to `https://my-awesome-feature--grief-matters-sanity-studio.netlify.app`

Branch deploys are linked to our "dev" dataset. You are free to make changes to the content hosted in your branch deployment without affecting production.

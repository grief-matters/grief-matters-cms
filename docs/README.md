- [Developer Guide](#developer-guide)
  - [Prerequisites](#prerequisites)
  - [Create a Sanity account](#create-a-sanity-account)
  - [Cloning the repository](#cloning-the-repository)
  - [Get the project running](#get-the-project-running)

## Developer Guide

### Prerequisites

1. Permission to work on the project from Dan or Camille
2. A Sanity account and an invitation to our Sanity Organization
3. Environment variables given by one of the team
4. Know which contribution workflow to use (fork and pull or direct repo access)

### Create a Sanity account

1. Once granted permission to work on the project head over to [Sanity.io](https://sanity.io/get-started) to create a Sanity account
2. Once you have set up your account, get back in touch with the project team. They'll invite you to the Sanity project
3. Keep your account details to hand

### Cloning the repository

**Direct access**

If you have direct access to the repo as a long-term contributor you can just clone the repo and get started.

1. Navigate to the https://github.com/grief-matters/whygriefmatters.org
2. Clone the repo using your [preferred method](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

**Start from a fork**

If you're making a one off contribution or just helping out where you can, you'll need to follow a "fork and pull" workflow.

1. Navigate to the https://github.com/grief-matters/whygriefmatters.org repo
2. [Fork the repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository) to your personal GitHub account
3. [Clone the fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#cloning-your-forked-repository) you just created
4. It's a good idea to [sync your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#configuring-git-to-sync-your-fork-with-the-upstream-repository) with our upstream repo to make sure you keep up with changes

### Get the project running

1. `cd` into the project
2. Create a file named `.env` in the root of your project and add to it the following environment variables:
   ```shell
   SANITY_STUDIO_PROJECT_ID="PROJECT_ID"
   SANITY_STUDIO_DATASET="dev"
   SANITY_STUDIO_API_VERSION="2023-07-16"
   ```
3. Create a file named `.dev.vars` in the root of your project and add the following variables:
   ```shell
   WEBSITE_DEPLOY_HOOK="" # not needed in local development
   SANITY_STUDIO_DATASET="dev"
   ``` 
   These variables are required for local development.
4. Run `npm install` at the root of the project to install all dependencies.
5. Run `npm run dev` at the root of the project folder. This will build the studio application and start a local development server.
6. Once the build is complete, you can head over to http://localhost:3333.

> [!Note]
>
> You'll be provided the "project ID" as part of being granted permission to work on the project

> [!Note]
>
> When you run the server for the first time, you'll be asked to authenticate to Sanity.io

You should now see the Sanity Studio running in your browser!

As you modify and save the code, the server will automatically rebuild the studio and refresh the browser.

You can stop your development server by pressing `Ctrl-C` in the terminal where the server is running.

Once you're up and running head over to the [Sanity docs](https://www.sanity.io/docs) for info on how to develop the Studio.

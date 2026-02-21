import { AutoRouter, type IRequest } from "itty-router";

import { apiRoutes } from "../shared/routes";

import {
  handleGetDeployments,
  handleWebsiteDeploy,
  handleGetDeployment,
  handleGetLatestDeployment,
} from "./handlers/deployments";
import { handleFallback } from "./handlers/fallback";
import {
  handleGetBrokenLinks,
  handleScheduledBrokenLinkCheck,
} from "./handlers/brokenLinks";

export type CFArgs = [Env, ExecutionContext];

const router = AutoRouter<IRequest, CFArgs>();

router
  .post(apiRoutes.deployments, handleWebsiteDeploy)
  .get(apiRoutes.deployments, handleGetDeployments)
  .get(apiRoutes.latestDeployment, handleGetLatestDeployment)
  .get(apiRoutes.deployment, handleGetDeployment)
  .get(apiRoutes.brokenLinks, handleGetBrokenLinks)
  .all("*", handleFallback);

export default {
  fetch: router.fetch,
  scheduled: handleScheduledBrokenLinkCheck,
};

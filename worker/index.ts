import { AutoRouter, type IRequest } from "itty-router";

import { apiRoutes } from "../shared/routes";

import {
  handleGetDeployments,
  handleWebsiteDeploy,
} from "./handlers/deployments";
import { handleFallback } from "./handlers/fallback";
import { handleGetDeployment } from "./handlers/deployment";
import { handleGetLatestDeployment } from "./handlers/latestDeployment";

export type CFArgs = [Env, ExecutionContext];

const router = AutoRouter<IRequest, CFArgs>();

router
  .post(apiRoutes.deployments, handleWebsiteDeploy)
  .get(apiRoutes.deployments, handleGetDeployments)
  .get(apiRoutes.latestDeployment, handleGetLatestDeployment)
  .get(apiRoutes.deployment, handleGetDeployment)
  .all("*", handleFallback);

export default router;

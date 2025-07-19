import { AutoRouter, IRequest } from "itty-router";
import { handleWebsiteDeploy } from "./handlers/website-deploy";

export interface Env {
  WEBSITE_DEPLOY_HOOK: string;
}

type CFArgs = [Env, ExecutionContext];

const router = AutoRouter<IRequest, CFArgs>();

router.post("/cfw-api/website-deploy", handleWebsiteDeploy);

export default router;

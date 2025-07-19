import { Env } from "..";

export async function handleWebsiteDeploy(request: Request, context: Env) {
  const deployHookUrl = context.WEBSITE_DEPLOY_HOOK;

  if (typeof deployHookUrl === "undefined") {
    return new Response("Deploy hook URL is not configured", { status: 500 });
  }

  try {
    const response = await fetch(deployHookUrl, { method: "POST" });

    if (!response.ok) {
      return new Response(`Deploy hook failed: ${response.statusText}`, {
        status: 500,
      });
    }

    return new Response("Deploy was successful!", { status: 200 });
  } catch (error) {
    return new Response(`Error triggering deploy: ${error}`, { status: 500 });
  }
}

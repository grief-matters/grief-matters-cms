// todo - I don't think we should have todo this as we're generating worker-configuration.d.ts automatically
interface Env {
  WEBSITE_DEPLOY_HOOK: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const deployHookUrl = context.env.WEBSITE_DEPLOY_HOOK;

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
};

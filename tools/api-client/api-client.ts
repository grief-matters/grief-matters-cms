import { fetcher } from "itty-fetcher";
import { createRoute } from "../../shared/routes";
import { Deployment } from "cloudflare/resources/pages/projects/projects";
import type { BrokenLinksReport } from "../../shared/types/broken-links";

const api = fetcher(process.env.SANITY_STUDIO_API_BASE_URL);

export async function deployWebsite(): Promise<Deployment> {
  try {
    const deployment = await api.post(createRoute("deployments"));
    return deployment;
  } catch (error) {
    console.error("[api-client.deployWebsite] Failed to deploy website");
    throw error;
  }
}

export async function getDeployment(id: string): Promise<Deployment> {
  try {
    const deployment = await api.get(
      createRoute("deployment", { deploymentId: id })
    );
    return deployment;
  } catch (error) {
    console.error("[api-client.getDeployment] Failed to get deployment");
    throw error;
  }
}

export async function getDeployments(): Promise<any> {
  try {
    const deployments = await api.get(createRoute("deployments"));
    return deployments;
  } catch (error) {
    console.error("[api-client.getDeployments] Failed to get deployments");
    throw error;
  }
}

export async function getLatestDeployment(): Promise<Deployment> {
  try {
    const deployment = await api.get(createRoute("latestDeployment"));
    return deployment;
  } catch (error) {
    console.error("[api-client.getDeployments] Failed to get deployments");
    throw error;
  }
}

export async function getBrokenLinks(): Promise<BrokenLinksReport> {
  try {
    const report = await api.get(createRoute("brokenLinks"));
    return report;
  } catch (error) {
    console.error("[api-client.getBrokenLinks] Failed to get broken links report");
    throw error;
  }
}

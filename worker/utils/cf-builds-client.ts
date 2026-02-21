import type { Build } from "../../shared/types/build";

const BASE_URL = "https://api.cloudflare.com/client/v4";

export function createCfBuildsClient(apiToken: string, accountId: string) {
  const request = async <T>(path: string, method = "GET"): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Cloudflare API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as { result: T };
    return data.result;
  };

  return {
    triggerBuild: async (triggerUuid: string): Promise<Build> => {
      const path = `/accounts/${accountId}/builds/triggers/${triggerUuid}/builds`;

      const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ branch: "main" }),
      });

      if (!response.ok) {
        throw new Error(
          `Cloudflare API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as { result: Build };
      return data.result;
    },

    listBuilds: async (workerTag: string): Promise<Build[]> => {
      return request<Build[]>(
        `/accounts/${accountId}/builds/workers/${workerTag}/builds`
      );
    },

    getBuild: async (buildUuid: string): Promise<Build> => {
      return request<Build>(
        `/accounts/${accountId}/builds/builds/${buildUuid}`
      );
    },
  };
}

export type CfBuildsClient = ReturnType<typeof createCfBuildsClient>;

/**
 * API routes
 */
export const apiRoutes = {
  deployments: "/api/deployments",
  latestDeployment: "/api/deployments/latest",
  deployment: "/api/deployments/:deploymentId",
  brokenLinks: "/api/broken-links",
} as const;

/**
 * Creates a concrete URL from a route template by replacing parameters
 */
export function createRoute(
  routeKey: keyof typeof apiRoutes,
  params?: Record<string, string | number>
): string {
  let url: string = apiRoutes[routeKey];
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }
  return url;
}

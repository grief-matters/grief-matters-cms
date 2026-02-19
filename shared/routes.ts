/**
 * API routes
 */
export const apiRoutes = {
  deployments: "/api/deployments",
  latestDeployment: "/api/deployments/latest",
  deployment: "/api/deployments/:deploymentId",
  brokenLinks: "/api/broken-links",
} as const;

export type RouteParams = Record<string, string | number>;

/**
 * Type-safe route creator that ensures required params are provided
 * Creates a concrete URL from a route template by replacing parameters
 */
export function createRoute<T extends keyof typeof apiRoutes>(
  routeKey: T,
  ...args: ExtractRouteParams<(typeof apiRoutes)[T]> extends Record<
    string,
    never
  >
    ? []
    : [ExtractRouteParams<(typeof apiRoutes)[T]>]
): string {
  let url: string = apiRoutes[routeKey];

  const params = args[0];
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
}

// Utility type to extract parameter names from route strings
type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string | number } & ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string | number }
    : {};

// Helper to get all route patterns (useful for itty-router setup)
export function getRoutePatterns(): string[] {
  return Object.values(apiRoutes);
}

// Helper to get route by key
export function getRoute<T extends keyof typeof apiRoutes>(
  key: T
): (typeof apiRoutes)[T] {
  return apiRoutes[key];
}

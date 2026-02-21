import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Build, BuildStatus } from "../shared/types/build";
import type { BrokenLinksReport } from "../shared/types/broken-links";
import { apiRoutes } from "../shared/routes";

const PORT = 8787;

// --- Fixture Data ---

const builds: Build[] = [
  {
    build_uuid: "b001",
    status: "stopped",
    build_outcome: "success",
    branch: "main",
    created_on: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    build_uuid: "b002",
    status: "stopped",
    build_outcome: "fail",
    branch: "main",
    created_on: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    build_uuid: "b003",
    status: "stopped",
    build_outcome: "success",
    branch: "main",
    created_on: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    build_uuid: "b004",
    status: "stopped",
    build_outcome: "cancelled",
    branch: "main",
    created_on: new Date(Date.now() - 3600000).toISOString(),
  },
];

const brokenLinksReport: BrokenLinksReport = {
  lastScanAt: new Date(Date.now() - 3600000).toISOString(),
  totalChecked: 142,
  totalDocuments: 85,
  scanDurationMs: 24530,
  entries: [
    {
      documentId: "doc-001",
      documentType: "article",
      documentTitle: "Understanding Grief After Loss",
      url: "https://example.com/broken-page",
      urlField: "resourceUrl",
      httpStatus: 404,
      error: "Not Found",
      status: "broken",
      consecutiveFailures: 3,
      firstFailedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      lastCheckedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      documentId: "doc-002",
      documentType: "podcast",
      documentTitle: "Grief Recovery Podcast",
      url: "https://slow-server.example.com/episode-5",
      urlField: "resourceUrl",
      httpStatus: null,
      error: "Request timed out after 10000ms",
      status: "timeout",
      consecutiveFailures: 2,
      firstFailedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      lastCheckedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      documentId: "doc-003",
      documentType: "blog",
      documentTitle: "Coping with Anniversaries",
      url: "https://nonexistent-domain-xyz.com/post",
      urlField: "resourceUrl",
      httpStatus: null,
      error: "DNS resolution failed",
      status: "dns_error",
      consecutiveFailures: 5,
      firstFailedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      lastCheckedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      documentId: "doc-004",
      documentType: "video",
      documentTitle: "Meditation for Grief",
      url: "https://example.com/moved-video",
      urlField: "resourceUrl",
      httpStatus: 301,
      error: "Permanent redirect",
      status: "warning",
      consecutiveFailures: 1,
      firstFailedAt: new Date(Date.now() - 86400000).toISOString(),
      lastCheckedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

let buildCounter = 100;

// --- Build State Simulation ---

function simulateBuildProgression(build: Build) {
  const transitions: { status: BuildStatus; delay: number }[] = [
    { status: "initializing", delay: 3000 },
    { status: "running", delay: 5000 },
    { status: "stopped", delay: 7000 },
  ];

  let elapsed = 0;
  for (const { status, delay } of transitions) {
    elapsed += delay;
    setTimeout(() => {
      build.status = status;
      if (status === "stopped") {
        build.build_outcome = "success";
      }
    }, elapsed);
  }
}

// --- Server ---

function setCors(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res: ServerResponse, data: unknown, status = 200) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  const pathname = url?.split("?")[0] ?? "/";

  if (method === "OPTIONS") {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/broken-links
  if (method === "GET" && pathname === apiRoutes.brokenLinks) {
    return json(res, brokenLinksReport);
  }

  // GET /api/deployments/latest
  if (method === "GET" && pathname === apiRoutes.latestDeployment) {
    return json(res, builds[builds.length - 1]);
  }

  // GET /api/deployments/:deploymentId
  const deploymentMatch = pathname.match(/^\/api\/deployments\/(.+)$/);
  if (method === "GET" && deploymentMatch) {
    const build = builds.find((b) => b.build_uuid === deploymentMatch[1]);
    if (build) return json(res, build);
    return json(res, { error: "Not found" }, 404);
  }

  // GET /api/deployments
  if (method === "GET" && pathname === apiRoutes.deployments) {
    return json(res, builds);
  }

  // POST /api/deployments
  if (method === "POST" && pathname === apiRoutes.deployments) {
    const newBuild: Build = {
      build_uuid: `b${++buildCounter}`,
      status: "queued",
      build_outcome: null,
      branch: "main",
      created_on: new Date().toISOString(),
    };
    builds.push(newBuild);
    simulateBuildProgression(newBuild);
    return json(res, newBuild, 201);
  }

  json(res, { error: "Not found" }, 404);
});

server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});

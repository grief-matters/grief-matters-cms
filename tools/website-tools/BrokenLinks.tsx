import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Inline,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
} from "@sanity/ui";
import { getBrokenLinks } from "../api-client/api-client";
import type {
  BrokenLinkEntry,
  BrokenLinksReport,
  LinkCheckStatus,
} from "../../shared/types/broken-links";

const STATUS_TONES: Record<LinkCheckStatus, "critical" | "caution"> = {
  broken: "critical",
  dns_error: "critical",
  warning: "caution",
  timeout: "caution",
};

const STATUS_LABELS: Record<LinkCheckStatus, string> = {
  broken: "Broken",
  dns_error: "DNS Error",
  warning: "Warning",
  timeout: "Timeout",
};

function formatDate(iso: string): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEditUrl(documentId: string): string {
  return `/intent/edit/id=${documentId}`;
}

export const BrokenLinks = () => {
  const [report, setReport] = useState<BrokenLinksReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [confirmedOnly, setConfirmedOnly] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      try {
        const data = await getBrokenLinks();
        if (!ignore) {
          setReport(data);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load broken links report");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchReport();
    return () => {
      ignore = true;
    };
  }, []);

  const documentTypes = useMemo(() => {
    if (!report) return [];
    const types = new Set(report.entries.map((e) => e.documentType));
    return [...types].sort();
  }, [report]);

  const filteredEntries = useMemo(() => {
    if (!report) return [];

    return report.entries.filter((entry) => {
      if (statusFilter !== "all" && entry.status !== statusFilter) return false;
      if (typeFilter !== "all" && entry.documentType !== typeFilter) return false;
      if (confirmedOnly && entry.consecutiveFailures < 2) return false;
      return true;
    });
  }, [report, statusFilter, typeFilter, confirmedOnly]);

  if (loading) {
    return (
      <Card border padding={4} margin={3}>
        <Stack space={4}>
          <Heading as="h3" size={2}>
            Broken Links
          </Heading>
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted>Loading report...</Text>
          </Flex>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card border padding={4} margin={3}>
        <Stack space={4}>
          <Heading as="h3" size={2}>
            Broken Links
          </Heading>
          <Card padding={3} border tone="critical">
            <Text>{error}</Text>
          </Card>
        </Stack>
      </Card>
    );
  }

  if (!report?.lastScanAt) {
    return (
      <Card border padding={4} margin={3}>
        <Stack space={4}>
          <Heading as="h3" size={2}>
            Broken Links
          </Heading>
          <Card padding={4} border tone="caution">
            <Text>No scan has been run yet. The first scan will run automatically on Sunday at 3am UTC.</Text>
          </Card>
        </Stack>
      </Card>
    );
  }

  return (
    <Card border padding={4} margin={3}>
      <Stack space={5}>
        <Heading as="h3" size={2}>
          Broken Links
        </Heading>
        <Text muted>
          Automated weekly scan of all published resource URLs.
        </Text>

        {/* Summary */}
        <Card border padding={3} tone="transparent">
          <Stack space={3}>
            <Heading as="h4" size={0}>
              Last Scan
            </Heading>
            <Inline space={4}>
              <Text size={1}>
                <strong>Date:</strong> {formatDate(report.lastScanAt)}
              </Text>
              <Text size={1}>
                <strong>URLs checked:</strong> {report.totalChecked}
              </Text>
              <Text size={1}>
                <strong>Documents:</strong> {report.totalDocuments}
              </Text>
              <Text size={1}>
                <strong>Issues found:</strong> {report.entries.length}
              </Text>
            </Inline>
          </Stack>
        </Card>

        {/* Filters */}
        <Card border padding={3}>
          <Stack space={3}>
            <Heading as="h4" size={0}>
              Filters
            </Heading>
            <Flex gap={3} wrap="wrap" align="center">
              <Box>
                <Stack space={2}>
                  <Text size={1} weight="medium">Status</Text>
                  <Select
                    fontSize={1}
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setStatusFilter(e.currentTarget.value)
                    }
                  >
                    <option value="all">All Statuses</option>
                    <option value="broken">Broken</option>
                    <option value="warning">Warning</option>
                    <option value="timeout">Timeout</option>
                    <option value="dns_error">DNS Error</option>
                  </Select>
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <Text size={1} weight="medium">Document Type</Text>
                  <Select
                    fontSize={1}
                    value={typeFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setTypeFilter(e.currentTarget.value)
                    }
                  >
                    <option value="all">All Types</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </Box>
              <Box>
                <Flex align="center" gap={2} style={{ paddingTop: 18 }}>
                  <Switch
                    checked={confirmedOnly}
                    onChange={() => setConfirmedOnly(!confirmedOnly)}
                  />
                  <Text size={1}>Show only confirmed broken (2+ failures)</Text>
                </Flex>
              </Box>
            </Flex>
          </Stack>
        </Card>

        {/* Results */}
        {filteredEntries.length === 0 ? (
          <Card padding={4} border tone="positive">
            <Text>
              {report.entries.length === 0
                ? "No broken links found!"
                : "No results match the current filters."}
            </Text>
          </Card>
        ) : (
          <Stack space={3}>
            <Text size={1} muted>
              Showing {filteredEntries.length} of {report.entries.length} issues
            </Text>
            {filteredEntries.map((entry, i) => (
              <BrokenLinkCard key={`${entry.documentId}-${entry.urlField}-${i}`} entry={entry} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

function BrokenLinkCard({ entry }: { entry: BrokenLinkEntry }) {
  return (
    <Card border padding={3}>
      <Stack space={3}>
        <Flex align="center" gap={2} wrap="wrap">
          <Badge tone={STATUS_TONES[entry.status]}>
            {STATUS_LABELS[entry.status]}
          </Badge>
          <Badge>{entry.documentType}</Badge>
          {entry.consecutiveFailures >= 2 && (
            <Badge tone="critical">
              {entry.consecutiveFailures}x failed
            </Badge>
          )}
        </Flex>
        <Text size={1} weight="medium">
          {entry.documentTitle}
        </Text>
        <Text size={1} muted>
          <strong>{entry.urlField}:</strong>{" "}
          <a href={entry.url} target="_blank" rel="noopener noreferrer">
            {entry.url}
          </a>
        </Text>
        <Text size={0} muted>
          {entry.error}
          {entry.httpStatus ? ` (HTTP ${entry.httpStatus})` : ""}
        </Text>
        <Flex gap={3} align="center">
          <Text size={0} muted>
            First failed: {formatDate(entry.firstFailedAt)}
          </Text>
          <Text size={0} muted>
            Last checked: {formatDate(entry.lastCheckedAt)}
          </Text>
          <Box style={{ marginLeft: "auto" }}>
            <Button
              as="a"
              href={getEditUrl(entry.documentId)}
              text="Edit"
              mode="ghost"
              fontSize={1}
              padding={2}
            />
          </Box>
        </Flex>
      </Stack>
    </Card>
  );
}

export default BrokenLinks;

import type { StoredBlocker } from "@okyrychenko-dev/react-action-guard";

export function formatScope(scope: string | ReadonlyArray<string>): string {
  if (Array.isArray(scope)) {
    return scope.join(", ");
  }

  return scope as string;
}

export function formatTimestamp(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) {
    return `${String(seconds)}s ago`;
  }
  if (seconds < 3600) {
    return `${String(Math.floor(seconds / 60))}m ago`;
  }
  return `${String(Math.floor(seconds / 3600))}h ago`;
}

export function getSortedBlockers(
  activeBlockers: ReadonlyMap<string, StoredBlocker>
): Array<[string, StoredBlocker]> {
  return Array.from(activeBlockers.entries()).sort(([, a], [, b]) => b.priority - a.priority);
}

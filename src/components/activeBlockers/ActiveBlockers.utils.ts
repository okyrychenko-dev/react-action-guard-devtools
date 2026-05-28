import type { StoredBlocker } from "@okyrychenko-dev/react-action-guard";

export function getSortedBlockers(
  activeBlockers: ReadonlyMap<string, StoredBlocker>
): Array<[string, StoredBlocker]> {
  return Array.from(activeBlockers.entries()).sort(([, a], [, b]) => b.priority - a.priority);
}

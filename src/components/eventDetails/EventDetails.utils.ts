export function formatFullTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return `${String(seconds)}s ago`;
  }

  if (seconds < 3600) {
    return `${String(Math.floor(seconds / 60))}m ago`;
  }

  return `${String(Math.floor(seconds / 3600))}h ago`;
}

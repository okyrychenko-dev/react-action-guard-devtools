export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${String(ms)}ms`;
  }

  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }

  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatScope(scope?: string | ReadonlyArray<string>): string {
  if (!scope) {
    return "global";
  }

  if (Array.isArray(scope)) {
    return scope.join(", ");
  }

  return scope as string;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

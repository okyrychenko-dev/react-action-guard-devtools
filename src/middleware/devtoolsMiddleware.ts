import { devtoolsStoreApi } from "../store";
import type { Middleware, MiddlewareContext } from "@okyrychenko-dev/react-action-guard";

export const DEVTOOLS_MIDDLEWARE_NAME = "action-guard-devtools";

/**
 * Creates the devtools middleware that records events
 */
export function createDevtoolsMiddleware(): Middleware {
  // Track add timestamps for duration calculation
  const addTimestamps = new Map<string, number>();
  const terminalActions = new Set<MiddlewareContext["action"]>([
    "remove",
    "timeout",
    "clear",
    "clear_scope",
  ]);

  const getDuration = (
    action: MiddlewareContext["action"],
    blockerId: string,
    timestamp: number
  ): number | undefined => {
    if (!terminalActions.has(action)) {
      return undefined;
    }

    const addTime = addTimestamps.get(blockerId);
    if (addTime === undefined) {
      return undefined;
    }

    addTimestamps.delete(blockerId);
    return timestamp - addTime;
  };

  return (context: MiddlewareContext): void => {
    const { addEvent } = devtoolsStoreApi.getState();

    // Track when blockers are added
    if (context.action === "add") {
      addTimestamps.set(context.blockerId, context.timestamp);
    }

    // Calculate duration for terminal events
    const duration = getDuration(context.action, context.blockerId, context.timestamp);

    // Record the event
    addEvent({
      action: context.action,
      blockerId: context.blockerId,
      config: context.config,
      timestamp: context.timestamp,
      prevState: context.prevState,
      duration,
    });
  };
}

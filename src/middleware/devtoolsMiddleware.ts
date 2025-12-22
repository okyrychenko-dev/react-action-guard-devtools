import { devtoolsStoreApi } from "../store";
import type { Middleware, MiddlewareContext } from "@okyrychenko-dev/react-action-guard";

export const DEVTOOLS_MIDDLEWARE_NAME = "action-guard-devtools";

/**
 * Creates the devtools middleware that records events
 */
export function createDevtoolsMiddleware(): Middleware {
  // Track add timestamps for duration calculation
  const addTimestamps = new Map<string, number>();

  return (context: MiddlewareContext): void => {
    const { addEvent } = devtoolsStoreApi.getState();

    // Track when blockers are added
    if (context.action === "add") {
      addTimestamps.set(context.blockerId, context.timestamp);
    }

    // Calculate duration for remove, timeout, or cancel events
    let duration: number | undefined;
    if (
      context.action === "remove" ||
      context.action === "timeout" ||
      context.action === "cancel"
    ) {
      const addTime = addTimestamps.get(context.blockerId);
      if (addTime !== undefined) {
        duration = context.timestamp - addTime;
        addTimestamps.delete(context.blockerId);
      }
    }

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

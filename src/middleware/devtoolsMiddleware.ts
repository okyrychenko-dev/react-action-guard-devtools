import { devtoolsStoreApi } from "../store";
import type { Middleware, MiddlewareContext } from "@okyrychenko-dev/react-action-guard";

export const DEVTOOLS_MIDDLEWARE_NAME = "action-guard-devtools";

/**
 * Creates the devtools middleware that captures and records UI blocking events.
 *
 * This middleware intercepts all blocking events (add, remove, timeout, clear) and
 * forwards them to the devtools store for visualization in the ActionGuardDevtools panel.
 *
 * The middleware calculates the duration of each blocker by tracking when it was added
 * and when it was removed/timed out, providing insights into how long UI was blocked.
 *
 * **Note:** This middleware is automatically registered when you use the `ActionGuardDevtools`
 * component. You typically don't need to call this function directly unless you're manually
 * managing middleware registration.
 *
 * @returns Middleware function that can be registered with `configureMiddleware` or `registerMiddleware`
 *
 * @example
 * Manual middleware registration (advanced usage)
 * ```tsx
 * import { uiBlockingStoreApi } from '@okyrychenko-dev/react-action-guard';
 * import { createDevtoolsMiddleware, DEVTOOLS_MIDDLEWARE_NAME } from '@okyrychenko-dev/react-action-guard-devtools';
 *
 * // Register manually
 * const middleware = createDevtoolsMiddleware();
 * uiBlockingStoreApi.getState().registerMiddleware(DEVTOOLS_MIDDLEWARE_NAME, middleware);
 *
 * // Cleanup
 * uiBlockingStoreApi.getState().unregisterMiddleware(DEVTOOLS_MIDDLEWARE_NAME);
 * ```
 *
 * @example
 * Automatic registration (recommended)
 * ```tsx
 * import { ActionGuardDevtools } from '@okyrychenko-dev/react-action-guard-devtools';
 *
 * // Middleware registered automatically when component mounts
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <ActionGuardDevtools />
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link ActionGuardDevtools} for automatic middleware registration
 * @see {@link https://github.com/okyrychenko-dev/react-action-guard#middleware | Middleware documentation}
 *
 * @public
 * @since 0.6.0
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
      scope: context.scope,
      count: context.count,
    });
  };
}

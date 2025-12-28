import { uiBlockingStoreApi } from "@okyrychenko-dev/react-action-guard";
import { ReactElement, useEffect, useMemo, useRef } from "react";
import { DEVTOOLS_MIDDLEWARE_NAME, createDevtoolsMiddleware } from "../../middleware";
import { useDevtoolsStore } from "../../store";
import { getDevtoolsKeyboardAction } from "./ActionGuardDevtools.utils";
import ActionGuardDevtoolsContent from "./ActionGuardDevtoolsContent";
import type { ActionGuardDevtoolsProps } from "./ActionGuardDevtools.types";
import "../../styles/theme.css";

/**
 * Internal component that handles all the devtools logic.
 * Separated to allow early return in production without breaking hooks rules.
 */
function ActionGuardDevtoolsInternal(
  props: Omit<ActionGuardDevtoolsProps, "showInProduction">
): ReactElement {
  const { position = "right", defaultOpen = false, maxEvents = 200, store: customStore } = props;

  const { setOpen, setMaxEvents, isOpen, togglePause, clearEvents } = useDevtoolsStore();

  // Get the store to use (custom or global)
  const targetStore = useMemo(() => customStore ?? uiBlockingStoreApi, [customStore]);

  // Register middleware on mount
  useEffect(() => {
    const storeState = targetStore.getState();
    const middleware = createDevtoolsMiddleware();

    storeState.registerMiddleware(DEVTOOLS_MIDDLEWARE_NAME, middleware);

    return () => {
      storeState.unregisterMiddleware(DEVTOOLS_MIDDLEWARE_NAME);
    };
  }, [targetStore]);

  // Set initial state
  useEffect(() => {
    setOpen(defaultOpen);
    setMaxEvents(maxEvents);
  }, [defaultOpen, maxEvents, setOpen, setMaxEvents]);

  // Stable ref for keyboard handler to avoid re-registering event listener
  const stateRef = useRef({ isOpen, setOpen, togglePause, clearEvents });

  // Keep ref in sync with latest values
  useEffect(() => {
    stateRef.current = { isOpen, setOpen, togglePause, clearEvents };
  }, [isOpen, setOpen, togglePause, clearEvents]);

  // Register keyboard shortcuts once
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const { isOpen, setOpen, togglePause, clearEvents } = stateRef.current;
      const action = getDevtoolsKeyboardAction(event, isOpen);

      if (!action) {
        return;
      }

      if (action.preventDefault) {
        event.preventDefault();
      }

      switch (action.action) {
        case "close":
          setOpen(false);
          break;
        case "togglePause":
          togglePause();
          break;
        case "clearEvents":
          clearEvents();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <ActionGuardDevtoolsContent position={position} store={customStore} />;
}

/**
 * ActionGuardDevtools - Visual developer tools panel for debugging UI blocking.
 *
 * This component provides a floating developer tools panel that visualizes all UI blocking
 * events in real-time. It shows active blockers, their priorities, scopes, and provides
 * a timeline of all blocking events with filtering and search capabilities.
 *
 * **Key Features:**
 * - Real-time visualization of active blockers
 * - Timeline of all blocking events (add, remove, timeout)
 * - Filter by action type, scope, or search term
 * - Pause/resume event capture
 * - Keyboard shortcuts (Esc to close, P to pause, C to clear)
 * - Draggable and resizable panel
 * - Works with both global store and custom store instances
 *
 * **Performance:**
 * - Automatically disabled in production builds (returns `null`)
 * - Only allocates resources in development
 * - Uses `showInProduction` prop to override if needed
 *
 * **Integration:**
 * - Automatically registers devtools middleware on mount
 * - Cleans up middleware on unmount
 * - No configuration required for basic usage
 *
 * @param props - Configuration props for the devtools panel
 * @param props.position - Panel position: 'left' | 'right' | 'top' | 'bottom' (default: 'right')
 * @param props.defaultOpen - Whether panel is open initially (default: false)
 * @param props.maxEvents - Maximum events to store in timeline (default: 200)
 * @param props.showInProduction - Show panel even in production (default: false)
 * @param props.store - Custom store instance (default: global store)
 *
 * @returns React element in development, `null` in production (unless `showInProduction` is true)
 *
 * @example
 * Basic usage (global store)
 * ```tsx
 * import { ActionGuardDevtools } from '@okyrychenko-dev/react-action-guard-devtools';
 *
 * function App() {
 *   return (
 *     <div>
 *       <YourApp />
 *       <ActionGuardDevtools />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom configuration
 * ```tsx
 * <ActionGuardDevtools
 *   position="bottom"
 *   defaultOpen={true}
 *   maxEvents={500}
 * />
 * ```
 *
 * @example
 * With custom store instance (isolated state)
 * ```tsx
 * import { UIBlockingProvider } from '@okyrychenko-dev/react-action-guard';
 * import { ActionGuardDevtools } from '@okyrychenko-dev/react-action-guard-devtools';
 *
 * function IsolatedApp() {
 *   return (
 *     <UIBlockingProvider>
 *       {({ store }) => (
 *         <>
 *           <YourApp />
 *           <ActionGuardDevtools store={store} />
 *         </>
 *       )}
 *     </UIBlockingProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Keyboard shortcuts
 * ```
 * Esc        - Close devtools panel
 * Ctrl/⌘ + P - Toggle pause/resume event capture
 * Ctrl/⌘ + K - Clear all events
 * ```
 *
 * @see {@link https://github.com/okyrychenko-dev/react-action-guard-devtools | DevTools README}
 * @see {@link createDevtoolsMiddleware} for manual middleware registration
 *
 * @public
 * @since 0.6.0
 */
function ActionGuardDevtools(props: ActionGuardDevtoolsProps): ReactElement | null {
  const { showInProduction = false, ...others } = props;

  // Early return in production - no hooks called, no resources allocated
  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  return <ActionGuardDevtoolsInternal {...others} />;
}

export default ActionGuardDevtools;

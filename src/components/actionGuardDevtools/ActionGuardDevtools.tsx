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
 * ActionGuardDevtools - Developer tools panel for UI blocking visualization.
 *
 * In production, returns null immediately without initializing any stores or event listeners.
 * Use `showInProduction` prop to override this behavior if needed.
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

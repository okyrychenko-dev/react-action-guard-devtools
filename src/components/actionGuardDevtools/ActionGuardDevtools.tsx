import { uiBlockingStoreApi } from "@okyrychenko-dev/react-action-guard";
import { ReactElement, useCallback, useEffect, useMemo } from "react";
import { DEVTOOLS_MIDDLEWARE_NAME, createDevtoolsMiddleware } from "../../middleware";
import { useDevtoolsStore } from "../../store";
import ActionGuardDevtoolsContent from "./ActionGuardDevtoolsContent";
import type { ActionGuardDevtoolsProps } from "./ActionGuardDevtools.types";
import { getDevtoolsKeyboardAction } from "./ActionGuardDevtools.utils";
import "../../styles/theme.css";

function ActionGuardDevtools(props: ActionGuardDevtoolsProps): ReactElement | null {
  const {
    position = "right",
    defaultOpen = false,
    maxEvents = 200,
    showInProduction = false,
    store: customStore,
  } = props;

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

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [isOpen, setOpen, togglePause, clearEvents]
  );

  // Register keyboard shortcuts
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  return <ActionGuardDevtoolsContent position={position} store={customStore} />;
}

export default ActionGuardDevtools;

import { ReactElement } from "react";
import { useDevtoolsStore } from "../../store";
import { getPanelClassName } from "./DevtoolsPanel.utils";
import DevtoolsPanelContent from "./DevtoolsPanelContent";
import DevtoolsPanelHeader from "./DevtoolsPanelHeader";
import DevtoolsPanelTabs from "./DevtoolsPanelTabs";
import type { DevtoolsPosition } from "../../types";
import type { UIBlockingStoreApi } from "../actionGuardDevtools";

interface DevtoolsPanelProps {
  position: DevtoolsPosition;
  store?: UIBlockingStoreApi;
}

function DevtoolsPanel(props: DevtoolsPanelProps): ReactElement | null {
  const { position, store } = props;

  const {
    isOpen,
    isMinimized,
    activeTab,
    setActiveTab,
    toggleOpen,
    toggleMinimized,
    clearEvents,
    isPaused,
    togglePause,
    events,
  } = useDevtoolsStore();

  if (!isOpen) {
    return null;
  }

  return (
    <div className={getPanelClassName(position, isMinimized)}>
      <DevtoolsPanelHeader
        eventsCount={events.length}
        isPaused={isPaused}
        isMinimized={isMinimized}
        onTogglePause={togglePause}
        onClearEvents={clearEvents}
        onToggleMinimized={toggleMinimized}
        onClose={toggleOpen}
      />

      {!isMinimized && (
        <>
          <DevtoolsPanelTabs activeTab={activeTab} onSelectTab={setActiveTab} />
          <DevtoolsPanelContent activeTab={activeTab} store={store} />
        </>
      )}
    </div>
  );
}

export default DevtoolsPanel;

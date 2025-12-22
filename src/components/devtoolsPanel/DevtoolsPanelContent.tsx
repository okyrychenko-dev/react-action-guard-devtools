import { ReactElement } from "react";
import { ActiveBlockers } from "../activeBlockers";
import { Timeline } from "../timeline";
import type { DevtoolsState } from "../../types";
import type { UIBlockingStoreApi } from "../actionGuardDevtools";

interface DevtoolsPanelContentProps {
  activeTab: DevtoolsState["activeTab"];
  store?: UIBlockingStoreApi;
}

function DevtoolsPanelContent(props: DevtoolsPanelContentProps): ReactElement {
  const { activeTab, store } = props;

  return activeTab === "timeline" ? <Timeline /> : <ActiveBlockers store={store} />;
}

export default DevtoolsPanelContent;

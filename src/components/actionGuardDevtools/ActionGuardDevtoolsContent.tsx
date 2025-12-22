import { ReactElement } from "react";
import { DevtoolsPanel } from "../devtoolsPanel";
import { ToggleButton } from "../toggleButton";
import type { UIBlockingStoreApi } from "./ActionGuardDevtools.types";
import type { DevtoolsPosition } from "../../types";

interface ActionGuardDevtoolsContentProps {
  position: DevtoolsPosition;
  store?: UIBlockingStoreApi;
}

function ActionGuardDevtoolsContent(props: ActionGuardDevtoolsContentProps): ReactElement {
  const { position, store } = props;

  return (
    <>
      <ToggleButton position={position} store={store} />
      <DevtoolsPanel position={position} store={store} />
    </>
  );
}

export default ActionGuardDevtoolsContent;

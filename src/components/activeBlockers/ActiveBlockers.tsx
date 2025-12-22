import { uiBlockingStoreApi } from "@okyrychenko-dev/react-action-guard";
import { ReactElement, useMemo } from "react";
import { useStore } from "zustand";
import { getSortedBlockers } from "./ActiveBlockers.utils";
import ActiveBlockersEmptyState from "./ActiveBlockersEmptyState";
import ActiveBlockersList from "./ActiveBlockersList";
import type { UIBlockingStoreApi } from "../actionGuardDevtools";

interface ActiveBlockersProps {
  store?: UIBlockingStoreApi;
}

function ActiveBlockers(props: ActiveBlockersProps): ReactElement {
  const { store } = props;

  // Single subscription - use provided store or fall back to global
  const targetStore = store ?? uiBlockingStoreApi;
  const activeBlockers = useStore(targetStore, (state) => state.activeBlockers);

  const blockers = useMemo(() => getSortedBlockers(activeBlockers), [activeBlockers]);

  if (blockers.length === 0) {
    return <ActiveBlockersEmptyState />;
  }

  return <ActiveBlockersList blockers={blockers} />;
}

export default ActiveBlockers;

import type { DevtoolsPosition } from "../../types/devtools.types";
import type { UIBlockingStore } from "@okyrychenko-dev/react-action-guard";
import type { StoreApi } from "zustand";

/**
 * Store API type for UIBlockingProvider integration
 */
export type UIBlockingStoreApi = StoreApi<UIBlockingStore>;

/**
 * Props for the main ActionGuardDevtools component
 */
export interface ActionGuardDevtoolsProps {
  /** Position of the toggle button and panel */
  position?: DevtoolsPosition;
  /** Whether the panel is open by default */
  defaultOpen?: boolean;
  /** Maximum number of events to store */
  maxEvents?: number;
  /** Whether to show in production (default: false) */
  showInProduction?: boolean;
  /**
   * Custom store instance from UIBlockingProvider.
   * Use this when you have multiple isolated stores via UIBlockingProvider.
   * If not provided, the global store is used.
   */
  store?: UIBlockingStoreApi;
}

import {
  type ShallowStoreBindings,
  createShallowStore,
} from "@okyrychenko-dev/react-zustand-toolkit";
import { createDevtoolsActions } from "./devtoolsStore.actions";
import type { DevtoolsStore } from "../types/devtools.types";

/**
 * Devtools Store
 *
 * Global Zustand store for managing devtools state across the application.
 *
 * Features:
 * - Event history with circular buffer
 * - Timeline filtering by action/scope/search
 * - Pause/resume recording
 * - Panel open/minimize states
 * - Automatic shallow comparison for selectors
 */
const {
  useStore: useDevtoolsStore,
  useStoreApi: devtoolsStoreApi,
}: ShallowStoreBindings<DevtoolsStore> = createShallowStore<DevtoolsStore>(createDevtoolsActions);

export { useDevtoolsStore, devtoolsStoreApi };

import { DEFAULT_FILTER, DEFAULT_MAX_EVENTS, DEFAULT_TAB } from "./devtoolsStore.constants";
import type { DevtoolsEvent, DevtoolsStore } from "../types/devtools.types";
import type { StateCreator } from "zustand";

/**
 * Devtools Store Slice
 *
 * Implements the state and actions for devtools management.
 * This slice follows the Zustand slice pattern for better code organization.
 */
export const createDevtoolsActions: StateCreator<DevtoolsStore, [], [], DevtoolsStore> = (
  set,
  get
) => ({
  // Initial State
  events: [],
  maxEvents: DEFAULT_MAX_EVENTS,
  isOpen: false,
  isMinimized: false,
  activeTab: DEFAULT_TAB,
  filter: DEFAULT_FILTER,
  selectedEventId: null,
  isPaused: false,

  // Actions
  /**
   * Add a new event to history
   *
   * @param eventData - Event data without ID (auto-generated)
   */
  addEvent: (eventData): void => {
    if (get().isPaused) {
      return;
    }

    const event: DevtoolsEvent = {
      ...eventData,
      id: `${String(eventData.timestamp)}-${eventData.blockerId}-${Math.random().toString(36).slice(2, 8)}`,
    };

    set((state) => {
      const newEvents = [event, ...state.events];

      // Trim to max events (circular buffer)
      if (newEvents.length > state.maxEvents) {
        newEvents.pop();
      }

      return { events: newEvents };
    });
  },

  /**
   * Clear all events from history
   */
  clearEvents: (): void => {
    set({ events: [], selectedEventId: null });
  },

  /**
   * Toggle panel open/closed state
   */
  toggleOpen: (): void => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  /**
   * Set panel open state
   *
   * @param open - Whether panel should be open
   */
  setOpen: (open): void => {
    set({ isOpen: open });
  },

  /**
   * Toggle minimized state
   */
  toggleMinimized: (): void => {
    set((state) => ({ isMinimized: !state.isMinimized }));
  },

  /**
   * Set active tab
   *
   * @param tab - Tab to activate
   */
  setActiveTab: (tab): void => {
    set({ activeTab: tab, selectedEventId: null });
  },

  /**
   * Update filter settings (partial update)
   *
   * @param filterUpdate - Partial filter update
   */
  setFilter: (filterUpdate): void => {
    set((state) => ({
      filter: { ...state.filter, ...filterUpdate },
    }));
  },

  /**
   * Reset filters to default
   */
  resetFilter: (): void => {
    set({ filter: DEFAULT_FILTER });
  },

  /**
   * Select an event for detail view
   *
   * @param eventId - Event ID to select (null to deselect)
   */
  selectEvent: (eventId): void => {
    set({ selectedEventId: eventId });
  },

  /**
   * Toggle pause state (stops/resumes recording)
   */
  togglePause: (): void => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  /**
   * Set maximum events limit
   *
   * @param max - Maximum number of events to keep
   */
  setMaxEvents: (max): void => {
    set((state) => {
      const events = state.events.length > max ? state.events.slice(0, max) : state.events;

      return { maxEvents: max, events };
    });
  },
});

import { beforeEach, describe, expect, it } from "vitest";
import { selectFilteredEvents } from "../devtoolsStore.selectors";
import { devtoolsStoreApi } from "../devtoolsStore.store";
import type { DevtoolsEvent, DevtoolsStore } from "../../types";

describe("devtoolsStore", () => {
  beforeEach(() => {
    // Reset store completely before each test
    const store = devtoolsStoreApi.getState();
    store.clearEvents();
    store.setOpen(false);
    store.resetFilter();
    store.setActiveTab("timeline");
    // Ensure pause is off
    const currentState = devtoolsStoreApi.getState();
    if (currentState.isPaused) {
      store.togglePause();
    }
    if (currentState.isMinimized) {
      store.toggleMinimized();
    }
  });

  describe("events management", () => {
    it("should add event to store", () => {
      devtoolsStoreApi.getState().addEvent({
        action: "add",
        blockerId: "test-blocker",
        timestamp: Date.now(),
        config: {
          scope: "global",
          reason: "Test reason",
          priority: 10,
        },
      });

      const state = devtoolsStoreApi.getState();
      expect(state.events).toHaveLength(1);
      expect(state.events[0].blockerId).toBe("test-blocker");
      expect(state.events[0].action).toBe("add");
    });

    it("should generate unique ID for each event", () => {
      const store = devtoolsStoreApi.getState();

      store.addEvent({
        action: "add",
        blockerId: "blocker-1",
        timestamp: Date.now(),
      });

      store.addEvent({
        action: "add",
        blockerId: "blocker-2",
        timestamp: Date.now(),
      });

      const state = devtoolsStoreApi.getState();
      const ids = state.events.map((e) => e.id);
      expect(new Set(ids).size).toBe(2);
    });

    it("should clear all events", () => {
      const store = devtoolsStoreApi.getState();

      store.addEvent({
        action: "add",
        blockerId: "test",
        timestamp: Date.now(),
      });

      let state = devtoolsStoreApi.getState();
      expect(state.events).toHaveLength(1);

      store.clearEvents();

      state = devtoolsStoreApi.getState();
      expect(state.events).toHaveLength(0);
    });

    it("should respect maxEvents limit", () => {
      const store = devtoolsStoreApi.getState();
      store.setMaxEvents(3);

      for (let i = 0; i < 5; i++) {
        store.addEvent({
          action: "add",
          blockerId: `blocker-${i.toString()}`,
          timestamp: Date.now(),
        });
      }

      const state = devtoolsStoreApi.getState();
      expect(state.events).toHaveLength(3);
      // Should keep the most recent events (prepended)
      expect(state.events[0].blockerId).toBe("blocker-4");
      expect(state.events[2].blockerId).toBe("blocker-2");
    });

    it("should not add events when paused", () => {
      const store = devtoolsStoreApi.getState();
      store.togglePause();

      store.addEvent({
        action: "add",
        blockerId: "test",
        timestamp: Date.now(),
      });

      const state = devtoolsStoreApi.getState();
      expect(state.events).toHaveLength(0);
    });
  });

  describe("panel state", () => {
    it("should toggle open state", () => {
      const store = devtoolsStoreApi.getState();
      let state = devtoolsStoreApi.getState();

      expect(state.isOpen).toBe(false);

      store.toggleOpen();
      state = devtoolsStoreApi.getState();
      expect(state.isOpen).toBe(true);

      store.toggleOpen();
      state = devtoolsStoreApi.getState();
      expect(state.isOpen).toBe(false);
    });

    it("should set open state directly", () => {
      const store = devtoolsStoreApi.getState();

      store.setOpen(true);
      let state = devtoolsStoreApi.getState();
      expect(state.isOpen).toBe(true);

      store.setOpen(false);
      state = devtoolsStoreApi.getState();
      expect(state.isOpen).toBe(false);
    });

    it("should toggle minimized state", () => {
      const store = devtoolsStoreApi.getState();
      let state = devtoolsStoreApi.getState();

      expect(state.isMinimized).toBe(false);

      store.toggleMinimized();
      state = devtoolsStoreApi.getState();
      expect(state.isMinimized).toBe(true);
    });

    it("should switch active tab", () => {
      const store = devtoolsStoreApi.getState();
      let state = devtoolsStoreApi.getState();

      expect(state.activeTab).toBe("timeline");

      store.setActiveTab("blockers");
      state = devtoolsStoreApi.getState();
      expect(state.activeTab).toBe("blockers");
    });
  });

  describe("filtering", () => {
    it("should update filter", () => {
      const store = devtoolsStoreApi.getState();

      store.setFilter({
        search: "test",
      });

      const state = devtoolsStoreApi.getState();
      expect(state.filter.search).toBe("test");
    });

    it("should reset filter to default", () => {
      const store = devtoolsStoreApi.getState();

      store.setFilter({
        search: "test",
        scopes: ["custom"],
      });

      store.resetFilter();

      const state = devtoolsStoreApi.getState();
      expect(state.filter.search).toBe("");
      expect(state.filter.scopes).toEqual([]);
      expect(state.filter.actions).toEqual(["add", "remove", "update", "cancel", "timeout"]);
    });
  });

  describe("event selection", () => {
    it("should select event", () => {
      const store = devtoolsStoreApi.getState();

      store.selectEvent("event-123");

      const state = devtoolsStoreApi.getState();
      expect(state.selectedEventId).toBe("event-123");
    });

    it("should deselect event", () => {
      const store = devtoolsStoreApi.getState();

      store.selectEvent("event-123");
      store.selectEvent(null);

      const state = devtoolsStoreApi.getState();
      expect(state.selectedEventId).toBe(null);
    });
  });

  describe("pause functionality", () => {
    it("should toggle pause state", () => {
      const store = devtoolsStoreApi.getState();
      let state = devtoolsStoreApi.getState();

      expect(state.isPaused).toBe(false);

      store.togglePause();
      state = devtoolsStoreApi.getState();
      expect(state.isPaused).toBe(true);

      store.togglePause();
      state = devtoolsStoreApi.getState();
      expect(state.isPaused).toBe(false);
    });
  });

  describe("selectors", () => {
    const noop = (): void => undefined;
    const noopSetOpen = (_open: boolean): void => undefined;
    const noopSetActiveTab = (_tab: DevtoolsStore["activeTab"]): void => undefined;
    const noopSetFilter = (_filter: Partial<DevtoolsStore["filter"]>): void => undefined;
    const noopSelectEvent = (_eventId: string | null): void => undefined;
    const noopSetMaxEvents = (_max: number): void => undefined;
    const noopAddEvent = (_event: Omit<DevtoolsEvent, "id">): void => undefined;

    it("should exclude events without scope when scope filter is active", () => {
      const events: Array<DevtoolsEvent> = [
        {
          id: "1",
          action: "add",
          blockerId: "blocker-1",
          timestamp: 1,
          config: { scope: "scope-a" },
        },
        {
          id: "2",
          action: "add",
          blockerId: "blocker-2",
          timestamp: 2,
        },
        {
          id: "3",
          action: "add",
          blockerId: "blocker-3",
          timestamp: 3,
          config: { scope: "scope-b" },
        },
      ];

      const state: DevtoolsStore = {
        events,
        maxEvents: 200,
        isOpen: false,
        isMinimized: false,
        activeTab: "timeline",
        filter: {
          actions: ["add", "remove", "update", "cancel", "timeout"],
          scopes: ["scope-a"],
          search: "",
        },
        selectedEventId: null,
        isPaused: false,
        addEvent: noopAddEvent,
        clearEvents: noop,
        toggleOpen: noop,
        setOpen: noopSetOpen,
        toggleMinimized: noop,
        setActiveTab: noopSetActiveTab,
        setFilter: noopSetFilter,
        resetFilter: noop,
        selectEvent: noopSelectEvent,
        togglePause: noop,
        setMaxEvents: noopSetMaxEvents,
      };

      const filtered = selectFilteredEvents(state);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("1");
    });

    it("should include events that match any scope in array", () => {
      const events: Array<DevtoolsEvent> = [
        {
          id: "1",
          action: "add",
          blockerId: "blocker-1",
          timestamp: 1,
          config: { scope: ["scope-a", "scope-c"] },
        },
      ];

      const state: DevtoolsStore = {
        events,
        maxEvents: 200,
        isOpen: false,
        isMinimized: false,
        activeTab: "timeline",
        filter: {
          actions: ["add", "remove", "update", "cancel", "timeout"],
          scopes: ["scope-c"],
          search: "",
        },
        selectedEventId: null,
        isPaused: false,
        addEvent: noopAddEvent,
        clearEvents: noop,
        toggleOpen: noop,
        setOpen: noopSetOpen,
        toggleMinimized: noop,
        setActiveTab: noopSetActiveTab,
        setFilter: noopSetFilter,
        resetFilter: noop,
        selectEvent: noopSelectEvent,
        togglePause: noop,
        setMaxEvents: noopSetMaxEvents,
      };

      const filtered = selectFilteredEvents(state);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("1");
    });
  });
});

import { uiBlockingStoreApi } from "@okyrychenko-dev/react-action-guard";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_FILTER, DEFAULT_MAX_EVENTS, DEFAULT_TAB, devtoolsStoreApi } from "../../../store";
import { renderWithProviders } from "../../../test/utils";
import ActionGuardDevtools from "../ActionGuardDevtools";
import ActionGuardDevtoolsContent from "../ActionGuardDevtoolsContent";
import type { DevtoolsEvent } from "../../../types";

function resetDevtoolsStore(): void {
  devtoolsStoreApi.setState({
    events: [],
    maxEvents: DEFAULT_MAX_EVENTS,
    isOpen: false,
    isMinimized: false,
    activeTab: DEFAULT_TAB,
    filter: DEFAULT_FILTER,
    selectedEventId: null,
    isPaused: false,
  });
}

describe("ActionGuardDevtools", () => {
  beforeEach(() => {
    resetDevtoolsStore();
    uiBlockingStoreApi.getState().clearAllBlockers();
  });

  it("should render toggle button when closed", () => {
    renderWithProviders(<ActionGuardDevtools />);

    expect(screen.getByTitle("Open Action Guard Devtools")).toBeInTheDocument();
    expect(screen.queryByText("Action Guard")).not.toBeInTheDocument();
  });

  it("should open panel on toggle click", async () => {
    renderWithProviders(<ActionGuardDevtools />);

    fireEvent.click(screen.getByTitle("Open Action Guard Devtools"));

    await waitFor(() => {
      expect(screen.getByText("Action Guard")).toBeInTheDocument();
    });

    expect(screen.getByTitle("Close")).toBeInTheDocument();
    expect(screen.queryByTitle("Open Action Guard Devtools")).not.toBeInTheDocument();
  });

  it("should respect defaultOpen", async () => {
    renderWithProviders(<ActionGuardDevtools defaultOpen={true} />);

    await waitFor(() => {
      expect(screen.getByText("Action Guard")).toBeInTheDocument();
    });

    expect(screen.queryByTitle("Open Action Guard Devtools")).not.toBeInTheDocument();
  });

  it("should handle keyboard shortcuts", async () => {
    const events: Array<DevtoolsEvent> = [
      {
        id: "event-1",
        action: "add",
        blockerId: "blocker-1",
        timestamp: Date.now(),
      },
      {
        id: "event-2",
        action: "remove",
        blockerId: "blocker-2",
        timestamp: Date.now(),
      },
    ];
    devtoolsStoreApi.setState({ events });

    renderWithProviders(<ActionGuardDevtools defaultOpen={true} />);

    await waitFor(() => {
      expect(screen.getByText("Action Guard")).toBeInTheDocument();
    });

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByTitle("Pause recording")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: " " });
    expect(screen.getByTitle("Resume recording")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "c" });
    expect(screen.getByText("0")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByText("Action Guard")).not.toBeInTheDocument();
    });
    expect(screen.getByTitle("Open Action Guard Devtools")).toBeInTheDocument();
  });
});

describe("ActionGuardDevtoolsContent", () => {
  it("should render toggle button when panel is closed", () => {
    renderWithProviders(<ActionGuardDevtoolsContent position="right" />);

    expect(screen.getByTitle("Open Action Guard Devtools")).toBeInTheDocument();
  });
});

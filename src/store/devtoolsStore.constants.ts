import type { DevtoolsFilter } from "../types/devtools.types";

export const DEFAULT_FILTER: DevtoolsFilter = {
  actions: ["add", "remove", "update", "cancel", "timeout"],
  scopes: [],
  search: "",
};

export const DEFAULT_MAX_EVENTS = 200;

export const DEFAULT_TAB = "timeline" as const;

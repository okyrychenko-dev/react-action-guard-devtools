import { DevtoolsEvent, DevtoolsStore } from "../types";

/**
 * Selector for filtered events
 */
export function selectFilteredEvents(state: DevtoolsStore): Array<DevtoolsEvent> {
  const { events, filter } = state;

  return events.filter((event) => {
    // Filter by action type
    if (filter.actions.length > 0 && !filter.actions.includes(event.action)) {
      return false;
    }

    // Filter by scope
    if (filter.scopes.length > 0) {
      if (!event.config?.scope) {
        return false;
      }

      const eventScopes: ReadonlyArray<string> = Array.isArray(event.config.scope)
        ? event.config.scope
        : [event.config.scope];

      const hasMatchingScope = eventScopes.some((s: string) => filter.scopes.includes(s));

      if (!hasMatchingScope) {
        return false;
      }
    }

    // Filter by search query
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesId = event.blockerId.toLowerCase().includes(searchLower);
      const matchesReason = event.config?.reason?.toLowerCase().includes(searchLower);

      if (!matchesId && !matchesReason) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique scopes from all events (for filter dropdown)
 */
export function selectUniqueScopes(state: DevtoolsStore): Array<string> {
  const scopes = new Set<string>();

  state.events.forEach((event) => {
    if (event.config?.scope) {
      const eventScopes: ReadonlyArray<string> = Array.isArray(event.config.scope)
        ? event.config.scope
        : [event.config.scope];

      eventScopes.forEach((s: string) => scopes.add(s));
    }
  });

  return Array.from(scopes).sort();
}

export function selectAllEvents(state: { events: Array<unknown> }): Array<unknown> {
  return state.events;
}

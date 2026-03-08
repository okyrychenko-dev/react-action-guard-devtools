import { DevtoolsEvent, DevtoolsStore } from "../types";

type ScopeValue = string | ReadonlyArray<string> | undefined;

function normalizeScopes(scope: ScopeValue): ReadonlyArray<string> {
  if (!scope) {
    return [];
  }

  if (typeof scope === "string") {
    return [scope];
  }

  return scope;
}

function getEventScopes(event: DevtoolsEvent): ReadonlyArray<string> {
  const configScopes = normalizeScopes(event.config?.scope);
  if (configScopes.length > 0) {
    return configScopes;
  }

  return normalizeScopes(event.scope);
}

function matchesActionFilter(
  event: DevtoolsEvent,
  actions: DevtoolsStore["filter"]["actions"]
): boolean {
  return actions.length === 0 || actions.includes(event.action);
}

function matchesScopeFilter(event: DevtoolsEvent, scopes: Array<string>): boolean {
  if (scopes.length === 0) {
    return true;
  }

  const eventScopes = getEventScopes(event);
  if (eventScopes.length === 0) {
    return false;
  }

  return eventScopes.some((scope) => scopes.includes(scope));
}

function matchesSearchQuery(event: DevtoolsEvent, search: string): boolean {
  if (!search) {
    return true;
  }

  const searchLower = search.toLowerCase();
  const matchesId = event.blockerId.toLowerCase().includes(searchLower);
  const matchesReason = (event.config?.reason ?? "").toLowerCase().includes(searchLower);
  const matchesScope = getEventScopes(event).some((scope) =>
    scope.toLowerCase().includes(searchLower)
  );

  return matchesId || matchesReason || matchesScope;
}

/**
 * Selector for filtered events
 */
export function selectFilteredEvents(state: DevtoolsStore): Array<DevtoolsEvent> {
  const { events, filter } = state;

  return events.filter((event) => {
    return (
      matchesActionFilter(event, filter.actions) &&
      matchesScopeFilter(event, filter.scopes) &&
      matchesSearchQuery(event, filter.search)
    );
  });
}

/**
 * Get unique scopes from all events (for filter dropdown)
 */
export function selectUniqueScopes(state: DevtoolsStore): Array<string> {
  const scopes = new Set<string>();

  state.events.forEach((event) => {
    getEventScopes(event).forEach((scope) => scopes.add(scope));
  });

  return Array.from(scopes).sort();
}

export function selectAllEvents(state: DevtoolsStore): Array<DevtoolsEvent> {
  return state.events;
}

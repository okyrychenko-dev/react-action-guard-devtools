export type DevtoolsKeyboardAction = "close" | "togglePause" | "clearEvents";

export interface DevtoolsKeyboardResult {
  action: DevtoolsKeyboardAction;
  preventDefault: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

export function getDevtoolsKeyboardAction(
  event: KeyboardEvent,
  isOpen: boolean
): DevtoolsKeyboardResult | null {
  if (!isOpen) {
    return null;
  }

  if (isTypingTarget(event.target)) {
    return null;
  }

  switch (event.key) {
    case "Escape":
      return { action: "close", preventDefault: false };
    case " ":
      return { action: "togglePause", preventDefault: true };
    case "c":
    case "C":
      if (!event.metaKey && !event.ctrlKey) {
        return { action: "clearEvents", preventDefault: false };
      }
      return null;
    default:
      return null;
  }
}

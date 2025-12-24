import { clsx } from "clsx";
import positionStyles from "../../styles/position.module.css";
import styles from "./DevtoolsPanel.module.css";
import type { DevtoolsPosition } from "../../types";

export function getPositionClass(position: DevtoolsPosition): string {
  return position === "left" ? positionStyles.positionLeft : positionStyles.positionRight;
}

export function getPanelClassName(position: DevtoolsPosition, isMinimized: boolean): string {
  return clsx(
    styles.panel,
    positionStyles.positionBase,
    getPositionClass(position),
    positionStyles.overlayLayer,
    isMinimized ? styles.panelMinimized : styles.panelExpanded
  );
}

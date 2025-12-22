import { clsx } from "clsx";
import positionStyles from "../../styles/position.module.css";
import styles from "./ToggleButton.module.css";
import type { DevtoolsPosition } from "../../types";

export function getPositionClass(position: DevtoolsPosition): string {
  return position === "left" ? positionStyles.positionLeft : positionStyles.positionRight;
}

export function getToggleButtonClassName(position: DevtoolsPosition): string {
  return clsx(
    styles.toggleButton,
    positionStyles.positionBase,
    getPositionClass(position),
    positionStyles.overlayLayer
  );
}

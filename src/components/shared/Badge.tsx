import { clsx } from "clsx";
import { CSSProperties, ReactElement, ReactNode } from "react";
import sharedStyles from "../../styles/shared.module.css";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function Badge(props: BadgeProps): ReactElement {
  const { children, className, style } = props;

  return (
    <span className={clsx(sharedStyles.badge, className)} style={style}>
      {children}
    </span>
  );
}

export default Badge;

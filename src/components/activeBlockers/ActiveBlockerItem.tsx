import { StoredBlocker } from "@okyrychenko-dev/react-action-guard";
import { ReactElement } from "react";
import { Badge } from "../shared";
import styles from "./ActiveBlockers.module.css";
import { formatScope, formatTimestamp } from "./ActiveBlockers.utils";

interface BlockerItemProps {
  id: string;
  blocker: StoredBlocker;
}

function ActiveBlockerItem(props: BlockerItemProps): ReactElement {
  const { id, blocker } = props;

  return (
    <div className={styles.blockerItem}>
      <div className={styles.blockerHeader}>
        <span className={styles.blockerId}>{id}</span>
        <Badge className={styles.activeBadge}>Active</Badge>
      </div>
      <div className={styles.blockerMeta}>
        <span>Scope: {formatScope(blocker.scope)}</span>
        <span>Priority: {blocker.priority}</span>
        <span>Reason: {blocker.reason}</span>
        <span>Started: {formatTimestamp(blocker.timestamp)}</span>
      </div>
    </div>
  );
}

export default ActiveBlockerItem;

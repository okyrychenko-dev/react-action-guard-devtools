import { ReactElement } from "react";
import styles from "./EventItem.module.css";
import { formatDuration, formatScope } from "./EventItem.utils";
import type { DevtoolsEvent } from "../../types";

interface EventItemDetailsProps {
  event: DevtoolsEvent;
}

function EventItemDetails(props: EventItemDetailsProps): ReactElement {
  const { event } = props;
  const { config, duration } = event;

  return (
    <div className={styles.eventDetails}>
      <span>scope: {formatScope(config?.scope)}</span>
      {duration !== undefined && <span>duration: {formatDuration(duration)}</span>}
      {config?.priority !== undefined && <span>priority: {config.priority}</span>}
    </div>
  );
}

export default EventItemDetails;

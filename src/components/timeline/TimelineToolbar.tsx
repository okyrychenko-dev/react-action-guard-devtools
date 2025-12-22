import { ChangeEvent, ReactElement } from "react";
import styles from "./Timeline.module.css";

interface TimelineToolbarProps {
  search: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function TimelineToolbar(props: TimelineToolbarProps): ReactElement {
  const { search, onSearchChange } = props;

  return (
    <div className={styles.toolbar}>
      <input
        type="text"
        placeholder="Search by ID or reason..."
        value={search}
        className={styles.searchInput}
        onChange={onSearchChange}
      />
    </div>
  );
}

export default TimelineToolbar;

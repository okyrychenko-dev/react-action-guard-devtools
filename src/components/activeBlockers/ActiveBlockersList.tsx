import { ReactElement } from "react";
import { Content } from "../shared";
import ActiveBlockerItem from "./ActiveBlockerItem";
import type { StoredBlocker } from "@okyrychenko-dev/react-action-guard";

interface ActiveBlockersListProps {
  blockers: Array<[string, StoredBlocker]>;
}

function ActiveBlockersList(props: ActiveBlockersListProps): ReactElement {
  const { blockers } = props;

  return (
    <Content>
      {blockers.map(([id, blocker]) => (
        <ActiveBlockerItem key={id} id={id} blocker={blocker} />
      ))}
    </Content>
  );
}

export default ActiveBlockersList;

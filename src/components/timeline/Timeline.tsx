import { ChangeEvent, ReactElement, useCallback, useEffect } from "react";
import { selectFilteredEvents, useDevtoolsStore } from "../../store";
import { EventDetails } from "../eventDetails";
import { isFilterActive } from "./Timeline.utils";
import TimelineContent from "./TimelineContent";
import TimelineEmptyState from "./TimelineEmptyState";
import TimelineToolbar from "./TimelineToolbar";

function Timeline(): ReactElement {
  const { events, selectedEventId, selectEvent, filter, setFilter } = useDevtoolsStore((state) => ({
    events: selectFilteredEvents(state),
    selectedEventId: state.selectedEventId,
    selectEvent: state.selectEvent,
    filter: state.filter,
    setFilter: state.setFilter,
  }));

  const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) : null;

  // Clear selection if selected event was removed or filtered out.
  useEffect(() => {
    if (selectedEventId && !events.some((event) => event.id === selectedEventId)) {
      selectEvent(null);
    }
  }, [selectedEventId, events, selectEvent]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFilter({ search: e.target.value });
    },
    [setFilter]
  );

  const handleCloseDetails = useCallback(() => {
    selectEvent(null);
  }, [selectEvent]);

  if (events.length === 0 && !isFilterActive(filter)) {
    return <TimelineEmptyState />;
  }

  return (
    <>
      <TimelineToolbar search={filter.search} onSearchChange={handleSearchChange} />
      <TimelineContent
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={selectEvent}
      />
      {selectedEvent && <EventDetails event={selectedEvent} onClose={handleCloseDetails} />}
    </>
  );
}

export default Timeline;

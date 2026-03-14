import {
  areIntervalsOverlapping,
  differenceInMinutes,
  parseISO,
} from "date-fns";
import { getEventBlockStyle } from "../../helpers";
import type { IEvent } from "../../interfaces";
import { EventBlock } from "../../views/week-and-day-view/event-block";

interface RenderGroupedEventsProps {
  groupedEvents: IEvent[][];
  day: Date;
}

interface EventLayout {
  event: IEvent;
  left: number;
  width: number;
  zIndex: number;
}

function computeEventLayouts(groupedEvents: IEvent[][]): EventLayout[] {
  // Flatten all events from all groups, sorted by start time then by duration (longest first)
  const allEvents = groupedEvents
    .flat()
    .sort((a, b) => {
      const startDiff =
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
      if (startDiff !== 0) return startDiff;
      // Longer events first (they appear behind)
      const durationA = differenceInMinutes(
        parseISO(a.endDate),
        parseISO(a.startDate)
      );
      const durationB = differenceInMinutes(
        parseISO(b.endDate),
        parseISO(b.startDate)
      );
      return durationB - durationA;
    });

  if (allEvents.length === 0) return [];
  if (allEvents.length === 1) {
    return [{ event: allEvents[0], left: 0, width: 100, zIndex: 1 }];
  }

  const layouts: EventLayout[] = [];

  // For each event, find which other events it overlaps with
  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);

    // Find all events that overlap with this one
    const overlappingEvents = allEvents.filter(
      (other) =>
        other.id !== event.id &&
        areIntervalsOverlapping(
          { start: eventStart, end: eventEnd },
          { start: parseISO(other.startDate), end: parseISO(other.endDate) }
        )
    );

    if (overlappingEvents.length === 0) {
      // No overlap: full width
      layouts.push({ event, left: 0, width: 100, zIndex: 1 });
      continue;
    }

    // Count how many events come before this one (sorted order = visual order)
    const position = i;
    const overlappingBefore = overlappingEvents.filter((other) => {
      const otherIndex = allEvents.indexOf(other);
      return otherIndex < position;
    });
    const slot = overlappingBefore.length;

    // Check if starts are close (within 1 hour) to the first overlapping event
    const firstOverlapping = allEvents.find(
      (other) =>
        other.id !== event.id &&
        areIntervalsOverlapping(
          { start: eventStart, end: eventEnd },
          { start: parseISO(other.startDate), end: parseISO(other.endDate) }
        )
    );

    const startGapMinutes = firstOverlapping
      ? Math.abs(
          differenceInMinutes(eventStart, parseISO(firstOverlapping.startDate))
        )
      : 0;

    // Total number of concurrent events at this position
    const totalConcurrent = overlappingEvents.length + 1;

    let left: number;
    let width: number;

    if (totalConcurrent === 2) {
      if (startGapMinutes > 60) {
        // Far apart starts: both take full width, second shifted slightly
        if (slot === 0) {
          left = 0;
          width = 100;
        } else {
          left = 10;
          width = 90;
        }
      } else {
        // Close starts: first takes 2/3, second starts at ~40% and takes the rest
        if (slot === 0) {
          left = 0;
          width = 65;
        } else {
          left = 40;
          width = 60;
        }
      }
    } else {
      // 3+ concurrent events: stagger them
      const step = Math.min(25, 60 / totalConcurrent);
      left = slot * step;
      width = Math.max(40, 100 - left);
    }

    layouts.push({
      event,
      left,
      width,
      zIndex: slot + 1,
    });
  }

  return layouts;
}

export function RenderGroupedEvents({
  groupedEvents,
  day,
}: RenderGroupedEventsProps) {
  const layouts = computeEventLayouts(groupedEvents);

  return layouts.map(({ event, left, width, zIndex }) => {
    const style = getEventBlockStyle(event, day);

    return (
      <div
        key={event.id}
        className="absolute inset-x-0 pointer-events-none"
        style={style}
      >
        <EventBlock
          event={event}
          eventWidth={width}
          eventLeft={left}
          zIndex={zIndex}
        />
      </div>
    );
  });
}

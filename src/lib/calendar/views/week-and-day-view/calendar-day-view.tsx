import { format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { DayPicker } from "../../../components/ui/day-picker";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useCalendar } from "../../contexts/calendar-context";
import { useDragDrop } from "../../contexts/dnd-context";
import { groupEvents } from "../../helpers";
import type { IEvent } from "../../interfaces";
import { CalendarTimeline } from "../../views/week-and-day-view/calendar-time-line";
import { DayViewMultiDayEventsRow } from "../../views/week-and-day-view/day-view-multi-day-events-row";
import { EventBlock } from "../../views/week-and-day-view/event-block";
import { RenderGroupedEvents } from "../../views/week-and-day-view/render-grouped-events";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const HOUR_HEIGHT = 96;
const QUARTER_MINUTES = 15;

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const {
    selectedDate,
    setSelectedDate,
    users,
    use24HourFormat,
    onRequestAddEvent,
  } = useCalendar();
  const {
    isDragging,
    draggedEvent,
    dragPreview,
    dragOffsetY,
    handleEventDrop,
    updateDragPreview,
  } = useDragDrop();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const calcPositionFromCursor = useCallback(
    (_clientX: number, clientY: number) => {
      const grid = gridRef.current;
      if (!grid) return null;

      const rect = grid.getBoundingClientRect();
      const y = clientY - rect.top + grid.scrollTop - dragOffsetY;

      const totalMinutes = (y / HOUR_HEIGHT) * 60;
      const snappedMinutes =
        Math.floor(totalMinutes / QUARTER_MINUTES) * QUARTER_MINUTES;
      const clampedMinutes = Math.max(0, Math.min(23 * 60 + 45, snappedMinutes));

      const hour = Math.floor(clampedMinutes / 60);
      const minute = clampedMinutes % 60;

      return { date: selectedDate, hour, minute };
    },
    [selectedDate, dragOffsetY]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const pos = calcPositionFromCursor(e.clientX, e.clientY);
      if (pos) updateDragPreview(pos);
    },
    [calcPositionFromCursor, updateDragPreview]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const pos = calcPositionFromCursor(e.clientX, e.clientY);
      if (pos) handleEventDrop(pos.date, pos.hour, pos.minute);
    },
    [calcPositionFromCursor, handleEventDrop]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!gridRef.current?.contains(e.relatedTarget as Node)) {
        updateDragPreview(null);
      }
    },
    [updateDragPreview]
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      if (!scrollAreaRef.current) return;

      const scrollArea = scrollAreaRef.current;
      const rect = scrollArea.getBoundingClientRect();
      const scrollSpeed = 15;

      const scrollContainer =
        scrollArea.querySelector("[data-radix-scroll-area-viewport]") ||
        scrollArea;

      if (e.clientY < rect.top + 60) {
        scrollContainer.scrollTop -= scrollSpeed;
      }

      if (e.clientY > rect.bottom - 60) {
        scrollContainer.scrollTop += scrollSpeed;
      }
    };

    document.addEventListener("dragover", handleDragOver);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const getCurrentEvents = (events: IEvent[]) => {
    const now = new Date();

    return (
      events.filter((event) =>
        isWithinInterval(now, {
          start: parseISO(event.startDate),
          end: parseISO(event.endDate),
        })
      ) || []
    );
  };

  const currentEvents = getCurrentEvents(singleDayEvents);

  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col min-h-0">
        <div>
          <DayViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Day header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <span className="flex-1 border-l py-2 text-center text-xs font-medium text-t-quaternary">
              {format(selectedDate, "EE")}{" "}
              <span className="font-semibold text-t-secondary">
                {format(selectedDate, "d")}
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-scroll" ref={scrollAreaRef}>
          <div className="flex">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-xs text-t-quaternary">
                        {format(
                          new Date().setHours(hour, 0, 0, 0),
                          use24HourFormat ? "HH:00" : "h a"
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="relative flex-1 border-l">
              <div
                ref={gridRef}
                className="relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
              >
                {hours.map((hour, index) => (
                  <div
                    key={hour}
                    className="relative"
                    style={{ height: "96px" }}
                  >
                    {index !== 0 && (
                      <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                    )}

                    {[0, 15, 30, 45].map((minute) => (
                      <div
                        key={minute}
                        className="absolute inset-x-0 cursor-pointer transition-colors hover:bg-secondary"
                        style={{
                          top: `${(minute / 60) * 100}%`,
                          height: "25%",
                        }}
                        onClick={() =>
                          onRequestAddEvent?.({
                            startDate: selectedDate,
                            startTime: { hour, minute },
                          })
                        }
                      />
                    ))}

                    <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary"></div>
                  </div>
                ))}

                {/* Drag preview: render the dragged event at preview position */}
                {isDragging &&
                  draggedEvent &&
                  dragPreview &&
                  isSameDay(dragPreview.date, selectedDate) && (
                    <div
                      className="absolute inset-x-0 pointer-events-none z-30"
                      style={{
                        top: `${((dragPreview.hour * 60 + dragPreview.minute) / 1440) * 100}%`,
                      }}
                    >
                      <EventBlock
                        event={draggedEvent}
                        eventWidth={100}
                        eventLeft={0}
                        zIndex={30}
                      />
                    </div>
                  )}

                <RenderGroupedEvents
                  groupedEvents={groupedEvents}
                  day={selectedDate}
                />
              </div>

              <CalendarTimeline />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden w-72 divide-y border-l md:block">
        <DayPicker
          className="mx-auto w-fit"
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          initialFocus
        />

        <div className="flex-1 space-y-3">
          {currentEvents.length > 0 ? (
            <div className="flex items-start gap-2 px-4 pt-4">
              <span className="relative mt-[5px] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
              </span>

              <p className="text-sm font-semibold text-t-secondary">
                En ce moment
              </p>
            </div>
          ) : (
            <p className="p-4 text-center text-sm italic text-t-tertiary">
              Aucun rendez-vous en ce moment
            </p>
          )}

          {currentEvents.length > 0 && (
            <ScrollArea className="h-[422px] px-4" type="always">
              <div className="space-y-6 pb-4">
                {currentEvents.map((event) => {
                  const user = users.find((user) => user.id === event.user.id);

                  return (
                    <div key={event.id} className="space-y-1.5">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {event.title}
                      </p>

                      {user && (
                        <div className="flex items-center gap-1.5">
                          <User className="size-4 text-t-quinary" />
                          <span className="text-sm text-t-tertiary">
                            {user.name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4 text-t-quinary" />
                        <span className="text-sm text-t-tertiary">
                          {format(new Date(event.startDate), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-t-quinary" />
                        <span className="text-sm text-t-tertiary">
                          {format(
                            parseISO(event.startDate),
                            use24HourFormat ? "HH:mm" : "hh:mm a"
                          )}{" "}
                          -
                          {format(
                            parseISO(event.endDate),
                            use24HourFormat ? "HH:mm" : "hh:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

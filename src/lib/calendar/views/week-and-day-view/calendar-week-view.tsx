import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { fadeIn, staggerContainer, transition } from "../../animations";
import { useCalendar } from "../../contexts/calendar-context";
import { useDragDrop } from "../../contexts/dnd-context";
import { groupEvents } from "../../helpers";
import type { IEvent } from "../../interfaces";
import { CalendarTimeline } from "../../views/week-and-day-view/calendar-time-line";
import { RenderGroupedEvents } from "../../views/week-and-day-view/render-grouped-events";
import { WeekViewMultiDayEventsRow } from "../../views/week-and-day-view/week-view-multi-day-events-row";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const HOUR_HEIGHT = 96;
const QUARTER_MINUTES = 15;

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, use24HourFormat, onRequestAddEvent } = useCalendar();
  const { isDragging, dragPreview, handleEventDrop, updateDragPreview } =
    useDragDrop();

  const gridRef = useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const calcPositionFromCursor = useCallback(
    (clientX: number, clientY: number) => {
      const grid = gridRef.current;
      if (!grid) return null;

      const rect = grid.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top + grid.scrollTop;

      const colWidth = rect.width / 7;
      const dayIndex = Math.max(0, Math.min(6, Math.floor(x / colWidth)));

      const totalMinutes = (y / HOUR_HEIGHT) * 60;
      const snappedMinutes =
        Math.floor(totalMinutes / QUARTER_MINUTES) * QUARTER_MINUTES;
      const clampedMinutes = Math.max(0, Math.min(23 * 60 + 45, snappedMinutes));

      const hour = Math.floor(clampedMinutes / 60);
      const minute = clampedMinutes % 60;

      return { date: weekDays[dayIndex], hour, minute };
    },
    [weekDays]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const pos = calcPositionFromCursor(e.clientX, e.clientY);
      if (pos) {
        updateDragPreview(pos);
      }
    },
    [calcPositionFromCursor, updateDragPreview]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const pos = calcPositionFromCursor(e.clientX, e.clientY);
      if (pos) {
        handleEventDrop(pos.date, pos.hour, pos.minute);
      }
    },
    [calcPositionFromCursor, handleEventDrop]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      // Only clear preview if leaving the grid entirely
      if (!gridRef.current?.contains(e.relatedTarget as Node)) {
        updateDragPreview(null);
      }
    },
    [updateDragPreview]
  );

  return (
    <motion.div
      className="h-full flex flex-col"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      <motion.div
        className="flex flex-col items-center justify-center border-b p-4 text-sm sm:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <p>La vue semaine n'est pas recommandée sur les petits écrans.</p>
        <p>Veuillez utiliser un ordinateur ou passer en vue journalière.</p>
      </motion.div>

      <motion.div
        className="flex-col sm:flex flex-1 min-h-0"
        variants={staggerContainer}
      >
        <div>
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Week header */}
          <motion.div
            className="relative z-20 flex border-b"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7  border-l">
              {weekDays.map((day, index) => (
                <motion.span
                  key={day.toISOString()}
                  className="py-1 sm:py-2 text-center text-xs font-medium text-t-quaternary"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, ...transition }}
                >
                  <span className="block sm:hidden">
                    {format(day, "EEE").charAt(0)}
                    <span className="block font-semibold text-t-secondary text-xs">
                      {format(day, "d")}
                    </span>
                  </span>
                  <span className="hidden sm:inline">
                    {format(day, "EE")}{" "}
                    <span className="ml-1 font-semibold text-t-secondary">
                      {format(day, "d")}
                    </span>
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-scroll">
            <div className="flex">
              {/* Hours column */}
              <motion.div className="relative w-18" variants={staggerContainer}>
                {hours.map((hour, index) => (
                  <motion.div
                    key={hour}
                    className="relative"
                    style={{ height: "96px" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, ...transition }}
                  >
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
                  </motion.div>
                ))}
              </motion.div>

              {/* Week grid */}
              <motion.div
                className="relative flex-1 border-l"
                variants={staggerContainer}
              >
                <div
                  ref={gridRef}
                  className="grid grid-cols-7 divide-x"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                >
                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = singleDayEvents.filter(
                      (event) =>
                        isSameDay(parseISO(event.startDate), day) ||
                        isSameDay(parseISO(event.endDate), day)
                    );
                    const groupedEvents = groupEvents(dayEvents);

                    return (
                      <motion.div
                        key={day.toISOString()}
                        className="relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: dayIndex * 0.1, ...transition }}
                      >
                        {hours.map((hour, index) => (
                          <motion.div
                            key={hour}
                            className="relative"
                            style={{ height: "96px" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.01, ...transition }}
                          >
                            {index !== 0 && (
                              <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                            )}

                            {/* Click zones for adding events */}
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
                                    startDate: day,
                                    startTime: { hour, minute },
                                  })
                                }
                              />
                            ))}

                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary"></div>
                          </motion.div>
                        ))}

                        {/* Drag preview indicator */}
                        {isDragging &&
                          dragPreview &&
                          isSameDay(dragPreview.date, day) && (
                            <div
                              className="absolute inset-x-1 rounded-md bg-primary/20 border-2 border-primary/40 pointer-events-none z-30 transition-[top] duration-75"
                              style={{
                                top: `${((dragPreview.hour * 60 + dragPreview.minute) / 1440) * 100}%`,
                                height: "24px",
                              }}
                            />
                          )}

                        <RenderGroupedEvents
                          groupedEvents={groupedEvents}
                          day={day}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                <CalendarTimeline />
              </motion.div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

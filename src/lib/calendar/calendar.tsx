import React from "react";
import { CalendarProvider } from "./contexts/calendar-context";
import { DndProvider } from "./contexts/dnd-context";
import { CalendarHeader } from "./header/calendar-header";
import { IEvent, IUser } from "./interfaces";
import type {
  AddEventRequest,
  ShowEventRequest,
  ViewDayEventsRequest,
} from "./contexts/calendar-context";
import { CalendarBody } from "./calendar-body";

export type CalendarProps = {
  events: IEvent[];
  users: IUser[];
  onEventUpdate?: (event: IEvent) => void;
  onRequestAddEvent?: (request: AddEventRequest) => void;
  onRequestShowEvent?: (request: ShowEventRequest) => void;
  onRequestViewDayEvents?: (request: ViewDayEventsRequest) => void;
  disableTimeFormatToggle?: boolean;
  disableUserManagement?: boolean;
};

export function Calendar({
  events,
  users,
  onEventUpdate,
  onRequestAddEvent,
  onRequestShowEvent,
  onRequestViewDayEvents,
  disableTimeFormatToggle,
  disableUserManagement,
}: CalendarProps) {
  // const { events, users } = await getCalendarData();

  return (
    <CalendarProvider
      events={events}
      users={users}
      view="month"
      onEventUpdate={onEventUpdate}
      onRequestAddEvent={onRequestAddEvent}
      onRequestShowEvent={onRequestShowEvent}
      onRequestViewDayEvents={onRequestViewDayEvents}
      disableTimeFormatToggle={disableTimeFormatToggle}
      disableUserManagement={disableUserManagement}
    >
      <DndProvider>
        <div className="w-full h-full flex flex-col">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}

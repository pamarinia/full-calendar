import React from "react";
import { CalendarProvider } from "./contexts/calendar-context";
import { DndProvider } from "./contexts/dnd-context";
import { CalendarHeader } from "./header/calendar-header";
// import { getEvents, getUsers } from "../calendar/requests";
import { IEvent, IUser } from "./interfaces";
import { CalendarBody } from "./calendar-body";
// async function getCalendarData() {
//   return {
//     events: await getEvents(),
//     users: await getUsers(),
//   };
// }

export type CalendarProps = {
  events: IEvent[];
  users: IUser[];
};

export function Calendar({ events, users }: CalendarProps) {
  // const { events, users } = await getCalendarData();

  return (
    <CalendarProvider events={events} users={users} view="month">
      <DndProvider>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}

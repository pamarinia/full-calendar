"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { IEvent, IUser } from "../interfaces";
import type { TCalendarView, TEventColor } from "../types";
import { useLocalStorage } from "../hooks";

export interface AddEventRequest {
  startDate?: Date;
  startTime?: { hour: number; minute: number };
}

export interface ShowEventRequest {
  event: IEvent;
}

export interface ViewDayEventsRequest {
  date: Date;
}

interface ICalendarContext {
  selectedDate: Date;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
  agendaModeGroupBy: "date" | "color";
  setAgendaModeGroupBy: (groupBy: "date" | "color") => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  disableTimeFormatToggle: boolean;
  disableUserManagement: boolean;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  selectedColors: TEventColor[];
  filterEventsBySelectedColors: (colors: TEventColor) => void;
  filterEventsBySelectedUser: (userId: IUser["id"] | "all") => void;
  users: IUser[];
  events: IEvent[];
  // addEvent: (event: IEvent) => void;
  updateEvent: (event: IEvent) => void;
  // removeEvent: (eventId: number) => void;
  onRequestAddEvent?: (request: AddEventRequest) => void;
  onRequestShowEvent?: (request: ShowEventRequest) => void;
  onRequestViewDayEvents?: (request: ViewDayEventsRequest) => void;
  clearFilter: () => void;
}

interface CalendarSettings {
  badgeVariant: "dot" | "colored";
  view: TCalendarView;
  use24HourFormat: boolean;
  agendaModeGroupBy: "date" | "color";
}

const DEFAULT_SETTINGS: CalendarSettings = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  users,
  events,
  badge = "colored",
  view = "day",
  onEventUpdate,
  onRequestAddEvent,
  onRequestShowEvent,
  onRequestViewDayEvents,
  disableTimeFormatToggle = false,
  disableUserManagement = false,
}: {
  children: React.ReactNode;
  users: IUser[];
  events: IEvent[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
  onEventUpdate?: (event: IEvent) => void;
  onRequestAddEvent?: (request: AddEventRequest) => void;
  onRequestShowEvent?: (request: ShowEventRequest) => void;
  onRequestViewDayEvents?: (request: ViewDayEventsRequest) => void;
  disableTimeFormatToggle?: boolean;
  disableUserManagement?: boolean;
}) {
  const [settings, setSettings] = useLocalStorage<CalendarSettings>(
    "calendar-settings",
    {
      ...DEFAULT_SETTINGS,
      badgeVariant: badge,
      view: view,
    }
  );

  const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(
    settings.badgeVariant
  );
  const [currentView, setCurrentViewState] = useState<TCalendarView>(
    settings.view
  );
  const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(
    settings.use24HourFormat
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<
    "date" | "color"
  >(settings.agendaModeGroupBy);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
    "all"
  );
  const [selectedColors, setSelectedColors] = useState<TEventColor[]>([]);
  const [internalEvents, setInternalEvents] = useState<IEvent[]>(events || []);

  // Sync internal state when parent updates the events prop (e.g. after backend refresh)
  useEffect(() => {
    setInternalEvents(events || []);
  }, [events]);

  // const addEvent = (event: IEvent) => {
  //   setInternalEvents((prev) => [...prev, event]);
  //   onEventAdd?.(event);
  // };

  const updateEvent = (event: IEvent) => {
    const updated = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };
    setInternalEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updated : e))
    );
    onEventUpdate?.(updated);
  };

  // const removeEvent = (eventId: number) => {
  //   setInternalEvents((prev) => prev.filter((e) => e.id !== eventId));
  //   onEventRemove?.(eventId);
  // };

  const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
    setSettings({
      ...settings,
      ...newPartialSettings,
    });
  };

  const setBadgeVariant = (variant: "dot" | "colored") => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };

  const setView = (newView: TCalendarView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };

  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };

  const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  // Filtrage appliqué sur le state interne (optimistic updates)
  const filteredEvents = useMemo(() => {
    let result = internalEvents;

    if (selectedColors.length > 0) {
      result = result.filter((event) => {
        const eventColor = event.color || "blue";
        return selectedColors.includes(eventColor);
      });
    }

    if (selectedUserId !== "all") {
      result = result.filter((event) => event.user.id === selectedUserId);
    }

    return result;
  }, [internalEvents, selectedColors, selectedUserId]);

  const filterEventsBySelectedColors = (color: TEventColor) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
  };

  const filterEventsBySelectedUser = (userId: IUser["id"] | "all") => {
    setSelectedUserId(userId);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const clearFilter = () => {
    setSelectedColors([]);
    setSelectedUserId("all");
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserId,
    setSelectedUserId,
    badgeVariant,
    setBadgeVariant,
    users,
    selectedColors,
    filterEventsBySelectedColors,
    filterEventsBySelectedUser,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    // addEvent,
    updateEvent,
    // removeEvent,
    onRequestAddEvent,
    onRequestShowEvent,
    onRequestViewDayEvents,
    clearFilter,
    disableTimeFormatToggle,
    disableUserManagement,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}

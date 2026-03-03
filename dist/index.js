"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/index.ts
var index_exports = {};
__export(index_exports, {
  Calendar: () => Calendar2,
  CalendarSkeleton: () => CalendarSkeleton
});
module.exports = __toCommonJS(index_exports);

// src/lib/calendar/contexts/calendar-context.tsx
var import_react2 = require("react");

// src/lib/calendar/hooks.ts
var import_react = require("react");
var useLocalStorage = (key, initialValue) => {
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  const [storedValue, setStoredValue] = (0, import_react.useState)(readValue);
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  return [storedValue, setValue];
};
function useMediaQuery(query) {
  const [matches, setMatches] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

// src/lib/calendar/contexts/calendar-context.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_SETTINGS = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  agendaModeGroupBy: "date"
};
var CalendarContext = (0, import_react2.createContext)({});
function CalendarProvider({
  children,
  users,
  events,
  badge = "colored",
  view = "day",
  onEventUpdate,
  onRequestAddEvent,
  onRequestShowEvent,
  onRequestViewDayEvents
}) {
  const [settings, setSettings] = useLocalStorage(
    "calendar-settings",
    __spreadProps(__spreadValues({}, DEFAULT_SETTINGS), {
      badgeVariant: badge,
      view
    })
  );
  const [badgeVariant, setBadgeVariantState] = (0, import_react2.useState)(
    settings.badgeVariant
  );
  const [currentView, setCurrentViewState] = (0, import_react2.useState)(
    settings.view
  );
  const [use24HourFormat, setUse24HourFormatState] = (0, import_react2.useState)(
    settings.use24HourFormat
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = (0, import_react2.useState)(settings.agendaModeGroupBy);
  const [selectedDate, setSelectedDate] = (0, import_react2.useState)(/* @__PURE__ */ new Date());
  const [selectedUserId, setSelectedUserId] = (0, import_react2.useState)(
    "all"
  );
  const [selectedColors, setSelectedColors] = (0, import_react2.useState)([]);
  const [internalEvents, setInternalEvents] = (0, import_react2.useState)(events || []);
  (0, import_react2.useEffect)(() => {
    setInternalEvents(events || []);
  }, [events]);
  const updateEvent = (event) => {
    const updated = __spreadProps(__spreadValues({}, event), {
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString()
    });
    setInternalEvents(
      (prev) => prev.map((e) => e.id === event.id ? updated : e)
    );
    onEventUpdate == null ? void 0 : onEventUpdate(updated);
  };
  const updateSettings = (newPartialSettings) => {
    setSettings(__spreadValues(__spreadValues({}, settings), newPartialSettings));
  };
  const setBadgeVariant = (variant) => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };
  const setView = (newView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };
  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };
  const setAgendaModeGroupBy = (groupBy) => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };
  const filteredEvents = (0, import_react2.useMemo)(() => {
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
  const filterEventsBySelectedColors = (color) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected ? selectedColors.filter((c) => c !== color) : [...selectedColors, color];
    setSelectedColors(newColors);
  };
  const filterEventsBySelectedUser = (userId) => {
    setSelectedUserId(userId);
  };
  const handleSelectDate = (date) => {
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
    clearFilter
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarContext.Provider, { value, children });
}
function useCalendar() {
  const context = (0, import_react2.useContext)(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}

// src/lib/calendar/contexts/dnd-context.tsx
var import_react3 = __toESM(require("react"));
var import_sonner = require("sonner");
var import_jsx_runtime2 = require("react/jsx-runtime");
var DragDropContext = (0, import_react3.createContext)(
  void 0
);
function DndProvider({ children }) {
  const { updateEvent } = useCalendar();
  const [dragState, setDragState] = (0, import_react3.useState)({ draggedEvent: null, isDragging: false });
  const onEventDroppedRef = (0, import_react3.useRef)(null);
  const startDrag = (0, import_react3.useCallback)((event) => {
    setDragState({ draggedEvent: event, isDragging: true });
  }, []);
  const endDrag = (0, import_react3.useCallback)(() => {
    setDragState({ draggedEvent: null, isDragging: false });
  }, []);
  const calculateNewDates = (0, import_react3.useCallback)(
    (event, targetDate, hour, minute) => {
      const originalStart = new Date(event.startDate);
      const originalEnd = new Date(event.endDate);
      const duration = originalEnd.getTime() - originalStart.getTime();
      const newStart = new Date(targetDate);
      if (hour !== void 0) {
        newStart.setHours(hour, minute || 0, 0, 0);
      } else {
        newStart.setHours(
          originalStart.getHours(),
          originalStart.getMinutes(),
          0,
          0
        );
      }
      return {
        newStart,
        newEnd: new Date(newStart.getTime() + duration)
      };
    },
    []
  );
  const isSamePosition = (0, import_react3.useCallback)((date1, date2) => {
    return date1.getTime() === date2.getTime();
  }, []);
  const handleEventDrop = (0, import_react3.useCallback)(
    (targetDate, hour, minute) => {
      const { draggedEvent } = dragState;
      if (!draggedEvent) return;
      const { newStart, newEnd } = calculateNewDates(
        draggedEvent,
        targetDate,
        hour,
        minute
      );
      const originalStart = new Date(draggedEvent.startDate);
      if (isSamePosition(originalStart, newStart)) {
        endDrag();
        return;
      }
      const callback = onEventDroppedRef.current;
      if (callback) {
        callback(draggedEvent, newStart, newEnd);
      }
      endDrag();
    },
    [dragState, calculateNewDates, isSamePosition, endDrag]
  );
  const handleEventUpdate = (0, import_react3.useCallback)(
    (event, newStartDate, newEndDate) => {
      try {
        const updatedEvent = __spreadProps(__spreadValues({}, event), {
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString()
        });
        updateEvent(updatedEvent);
        import_sonner.toast.success("Event updated successfully");
      } catch (e) {
        import_sonner.toast.error("Failed to update event");
      }
    },
    [updateEvent]
  );
  import_react3.default.useEffect(() => {
    onEventDroppedRef.current = handleEventUpdate;
  }, [handleEventUpdate]);
  const contextValue = (0, import_react3.useMemo)(
    () => ({
      draggedEvent: dragState.draggedEvent,
      isDragging: dragState.isDragging,
      startDrag,
      endDrag,
      handleEventDrop
    }),
    [dragState, startDrag, endDrag, handleEventDrop]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DragDropContext.Provider, { value: contextValue, children });
}
function useDragDrop() {
  const context = (0, import_react3.useContext)(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
}

// src/lib/calendar/header/calendar-header.tsx
var import_framer_motion3 = require("framer-motion");
var import_lucide_react7 = require("lucide-react");

// src/lib/calendar/animations.ts
var fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};
var slideFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
};
var slideFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 }
};
var transition = {
  type: "spring",
  stiffness: 200,
  damping: 20
};
var staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
var buttonHover = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// src/lib/calendar/header/date-navigator.tsx
var import_date_fns2 = require("date-fns");
var import_framer_motion = require("framer-motion");
var import_lucide_react = require("lucide-react");
var import_react4 = require("react");

// src/lib/components/ui/badge.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/lib/components/ui/badge.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge(_a) {
  var _b = _a, {
    className,
    variant,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "asChild"
  ]);
  const Comp = asChild ? import_react_slot.Slot : "span";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className)
    }, props)
  );
}

// src/lib/components/ui/button.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime4 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority2.cva)(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "asChild"
  ]);
  const Comp = asChild ? import_react_slot2.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/lib/calendar/helpers.ts
var import_date_fns = require("date-fns");
var FORMAT_STRING = "MMM d, yyyy";
function rangeText(view, date) {
  let start;
  let end;
  switch (view) {
    case "month":
      start = (0, import_date_fns.startOfMonth)(date);
      end = (0, import_date_fns.endOfMonth)(date);
      break;
    case "week":
      start = (0, import_date_fns.startOfWeek)(date);
      end = (0, import_date_fns.endOfWeek)(date);
      break;
    case "day":
      return (0, import_date_fns.format)(date, FORMAT_STRING);
    case "year":
      start = (0, import_date_fns.startOfYear)(date);
      end = (0, import_date_fns.endOfYear)(date);
      break;
    case "agenda":
      start = (0, import_date_fns.startOfMonth)(date);
      end = (0, import_date_fns.endOfMonth)(date);
      break;
    default:
      return "Error while formatting";
  }
  return `${(0, import_date_fns.format)(start, FORMAT_STRING)} - ${(0, import_date_fns.format)(end, FORMAT_STRING)}`;
}
function navigateDate(date, view, direction) {
  const operations = {
    month: direction === "next" ? import_date_fns.addMonths : import_date_fns.subMonths,
    week: direction === "next" ? import_date_fns.addWeeks : import_date_fns.subWeeks,
    day: direction === "next" ? import_date_fns.addDays : import_date_fns.subDays,
    year: direction === "next" ? import_date_fns.addYears : import_date_fns.subYears,
    agenda: direction === "next" ? import_date_fns.addMonths : import_date_fns.subMonths
  };
  return operations[view](date, 1);
}
function getEventsCount(events, date, view) {
  const compareFns = {
    day: import_date_fns.isSameDay,
    week: import_date_fns.isSameWeek,
    month: import_date_fns.isSameMonth,
    year: import_date_fns.isSameYear,
    agenda: import_date_fns.isSameMonth
  };
  const compareFn = compareFns[view];
  return events.filter((event) => compareFn((0, import_date_fns.parseISO)(event.startDate), date)).length;
}
function groupEvents(dayEvents) {
  const sortedEvents = dayEvents.sort(
    (a, b) => (0, import_date_fns.parseISO)(a.startDate).getTime() - (0, import_date_fns.parseISO)(b.startDate).getTime()
  );
  const groups = [];
  for (const event of sortedEvents) {
    const eventStart = (0, import_date_fns.parseISO)(event.startDate);
    let placed = false;
    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = (0, import_date_fns.parseISO)(lastEventInGroup.endDate);
      if (eventStart >= lastEventEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([event]);
  }
  return groups;
}
function getEventBlockStyle(event, day, groupIndex, groupSize) {
  const startDate = (0, import_date_fns.parseISO)(event.startDate);
  const dayStart = (0, import_date_fns.startOfDay)(day);
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = (0, import_date_fns.differenceInMinutes)(eventStart, dayStart);
  const top = startMinutes / 1440 * 100;
  const width = 100 / groupSize;
  const left = groupIndex * width;
  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}
function getCalendarCells(selectedDate) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = (0, import_date_fns.endOfMonth)(selectedDate).getDate();
  const firstDayOfMonth = (0, import_date_fns.startOfMonth)(selectedDate).getDay();
  const daysInPrevMonth = (0, import_date_fns.endOfMonth)(new Date(year, month - 1)).getDate();
  const totalDays = firstDayOfMonth + daysInMonth;
  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + i + 1)
  }));
  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(year, month, i + 1)
  }));
  const nextMonthCells = Array.from(
    { length: (7 - totalDays % 7) % 7 },
    (_, i) => ({
      day: i + 1,
      currentMonth: false,
      date: new Date(year, month + 1, i + 1)
    })
  );
  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}
function calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate) {
  const monthStart = (0, import_date_fns.startOfMonth)(selectedDate);
  const monthEnd = (0, import_date_fns.endOfMonth)(selectedDate);
  const eventPositions = {};
  const occupiedPositions = {};
  (0, import_date_fns.eachDayOfInterval)({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });
  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = (0, import_date_fns.differenceInDays)(
        (0, import_date_fns.parseISO)(a.endDate),
        (0, import_date_fns.parseISO)(a.startDate)
      );
      const bDuration = (0, import_date_fns.differenceInDays)(
        (0, import_date_fns.parseISO)(b.endDate),
        (0, import_date_fns.parseISO)(b.startDate)
      );
      return bDuration - aDuration || (0, import_date_fns.parseISO)(a.startDate).getTime() - (0, import_date_fns.parseISO)(b.startDate).getTime();
    }),
    ...singleDayEvents.sort(
      (a, b) => (0, import_date_fns.parseISO)(a.startDate).getTime() - (0, import_date_fns.parseISO)(b.startDate).getTime()
    )
  ];
  sortedEvents.forEach((event) => {
    const eventStart = (0, import_date_fns.parseISO)(event.startDate);
    const eventEnd = (0, import_date_fns.parseISO)(event.endDate);
    const eventDays = (0, import_date_fns.eachDayOfInterval)({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd
    });
    let position = -1;
    for (let i = 0; i < 3; i++) {
      if (eventDays.every((day) => {
        const dayPositions = occupiedPositions[(0, import_date_fns.startOfDay)(day).toISOString()];
        return dayPositions && !dayPositions[i];
      })) {
        position = i;
        break;
      }
    }
    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = (0, import_date_fns.startOfDay)(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });
  return eventPositions;
}
function getMonthCellEvents(date, events, eventPositions) {
  const dayStart = (0, import_date_fns.startOfDay)(date);
  const eventsForDate = events.filter((event) => {
    const eventStart = (0, import_date_fns.parseISO)(event.startDate);
    const eventEnd = (0, import_date_fns.parseISO)(event.endDate);
    return dayStart >= eventStart && dayStart <= eventEnd || (0, import_date_fns.isSameDay)(dayStart, eventStart) || (0, import_date_fns.isSameDay)(dayStart, eventEnd);
  });
  return eventsForDate.map((event) => {
    var _a;
    return __spreadProps(__spreadValues({}, event), {
      position: (_a = eventPositions[event.id]) != null ? _a : -1,
      isMultiDay: event.startDate !== event.endDate
    });
  }).sort((a, b) => {
    if (a.isMultiDay && !b.isMultiDay) return -1;
    if (!a.isMultiDay && b.isMultiDay) return 1;
    return a.position - b.position;
  });
}
function formatTime(date, use24HourFormat) {
  const parsedDate = typeof date === "string" ? (0, import_date_fns.parseISO)(date) : date;
  if (!(0, import_date_fns.isValid)(parsedDate)) return "";
  return (0, import_date_fns.format)(parsedDate, use24HourFormat ? "HH:mm" : "h:mm a");
}
var getFirstLetters = (str) => {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0).toUpperCase()}${words[1].charAt(0).toUpperCase()}`;
};
var getEventsForMonth = (events, date) => {
  const startOfMonthDate = (0, import_date_fns.startOfMonth)(date);
  const endOfMonthDate = (0, import_date_fns.endOfMonth)(date);
  return events.filter((event) => {
    const eventStart = (0, import_date_fns.parseISO)(event.startDate);
    const eventEnd = (0, import_date_fns.parseISO)(event.endDate);
    return (0, import_date_fns.isValid)(eventStart) && (0, import_date_fns.isValid)(eventEnd) && eventStart <= endOfMonthDate && eventEnd >= startOfMonthDate;
  });
};
var getColorClass = (color) => {
  const colorClasses = {
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
    purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
  };
  return colorClasses[color] || "";
};
var getBgColor = (color) => {
  const colorClasses = {
    red: "bg-red-400 dark:bg-red-600",
    yellow: "bg-yellow-400 dark:bg-yellow-600",
    green: "bg-green-400 dark:bg-green-600",
    blue: "bg-blue-400 dark:bg-blue-600",
    orange: "bg-orange-400 dark:bg-orange-600",
    purple: "bg-purple-400 dark:bg-purple-600"
  };
  return colorClasses[color] || "";
};
var toCapitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// src/lib/calendar/header/date-navigator.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var MotionButton = import_framer_motion.motion.create(Button);
var MotionBadge = import_framer_motion.motion.create(Badge);
function DateNavigator({ view, events }) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const month = (0, import_date_fns2.formatDate)(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();
  const eventCount = (0, import_react4.useMemo)(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view]
  );
  const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        import_framer_motion.motion.span,
        {
          className: "text-lg font-semibold",
          initial: { x: -20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition,
          children: [
            month,
            " ",
            year
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_framer_motion.AnimatePresence, { mode: "wait", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        MotionBadge,
        {
          variant: "secondary",
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition,
          children: [
            eventCount,
            " events"
          ]
        },
        eventCount
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        MotionButton,
        {
          variant: "outline",
          size: "icon",
          className: "h-6 w-6",
          onClick: handlePrevious,
          variants: buttonHover,
          whileHover: "hover",
          whileTap: "tap",
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        import_framer_motion.motion.p,
        {
          className: "text-sm text-muted-foreground",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition,
          children: rangeText(view, selectedDate)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        MotionButton,
        {
          variant: "outline",
          size: "icon",
          className: "h-6 w-6",
          onClick: handleNext,
          variants: buttonHover,
          whileHover: "hover",
          whileTap: "tap",
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.ChevronRight, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}

// src/lib/calendar/header/filter.tsx
var import_lucide_react3 = require("lucide-react");

// src/lib/components/ui/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      )
    }, props)
  ) });
}
function DropdownMenuGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Group, __spreadValues({ "data-slot": "dropdown-menu-group" }, props));
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      onSelect: (e) => {
        e.preventDefault();
      }
    }, props)
  );
}
function DropdownMenuRadioGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.RadioGroup,
    __spreadValues({
      "data-slot": "dropdown-menu-radio-group"
    }, props)
  );
}
function DropdownMenuRadioItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    DropdownMenuPrimitive.RadioItem,
    __spreadProps(__spreadValues({
      "data-slot": "dropdown-menu-radio-item",
      className: cn(
        "focus:bg-accent cursor-pointer focus:text-accent-foreground relative flex items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      onSelect: (e) => {
        e.preventDefault();
      }
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react2.CircleIcon, { className: "size-2 fill-current" }) }) }),
        children
      ]
    })
  );
}
function DropdownMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )
    }, props)
  );
}
function DropdownMenuSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    DropdownMenuPrimitive.Separator,
    __spreadValues({
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className)
    }, props)
  );
}
function DropdownMenuShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "span",
    __spreadValues({
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )
    }, props)
  );
}

// src/lib/components/ui/separator.tsx
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"));
var import_jsx_runtime7 = require("react/jsx-runtime");
function Separator2(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    SeparatorPrimitive.Root,
    __spreadValues({
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )
    }, props)
  );
}

// src/lib/components/ui/toggle.tsx
var TogglePrimitive = __toESM(require("@radix-ui/react-toggle"));
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime8 = require("react/jsx-runtime");
var toggleVariants = (0, import_class_variance_authority3.cva)(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Toggle(_a) {
  var _b = _a, {
    className,
    variant,
    size
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    TogglePrimitive.Root,
    __spreadValues({
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className }))
    }, props)
  );
}

// src/lib/calendar/header/filter.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function FilterEvents() {
  const { selectedColors, filterEventsBySelectedColors, clearFilter } = useCalendar();
  const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange"
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Toggle, { variant: "outline", className: "cursor-pointer w-fit", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.Filter, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(DropdownMenuContent, { align: "end", className: "w-[150px]", children: [
      colors.map((color) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        DropdownMenuItem,
        {
          className: "flex items-center gap-2 cursor-pointer",
          onClick: (e) => {
            e.preventDefault();
            filterEventsBySelectedColors(color);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                className: `size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "capitalize flex justify-center items-center gap-2", children: [
              color,
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: selectedColors.includes(color) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-blue-500", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.CheckIcon, { className: "size-4" }) }) })
            ] })
          ]
        },
        color
      )),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Separator2, { className: "my-2" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        DropdownMenuItem,
        {
          disabled: selectedColors.length === 0,
          className: "flex gap-2 cursor-pointer",
          onClick: (e) => {
            e.preventDefault();
            clearFilter();
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.RefreshCcw, { className: "size-3.5" }),
            "Clear Filter"
          ]
        }
      )
    ] })
  ] });
}

// src/lib/calendar/header/today-button.tsx
var import_date_fns3 = require("date-fns");
var import_framer_motion2 = require("framer-motion");
var import_jsx_runtime10 = require("react/jsx-runtime");
var MotionButton2 = import_framer_motion2.motion.create(Button);
function TodayButton() {
  const { setSelectedDate } = useCalendar();
  const today = /* @__PURE__ */ new Date();
  const handleClick = () => setSelectedDate(today);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    MotionButton2,
    {
      variant: "outline",
      className: "flex h-14 w-14 flex-col items-center justify-center p-0 text-center",
      onClick: handleClick,
      variants: buttonHover,
      whileHover: "hover",
      whileTap: "tap",
      transition,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          import_framer_motion2.motion.span,
          {
            className: "w-full bg-primary py-1 text-xs font-semibold text-primary-foreground",
            initial: { y: -10, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: __spreadValues({ delay: 0.1 }, transition),
            children: (0, import_date_fns3.formatDate)(today, "MMM").toUpperCase()
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          import_framer_motion2.motion.span,
          {
            className: "text-lg font-bold",
            initial: { y: 10, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: __spreadValues({ delay: 0.2 }, transition),
            children: today.getDate()
          }
        )
      ]
    }
  );
}

// src/lib/components/ui/avatar.tsx
var AvatarPrimitive = __toESM(require("@radix-ui/react-avatar"));
var import_jsx_runtime11 = require("react/jsx-runtime");
function Avatar(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AvatarPrimitive.Root,
    __spreadValues({
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )
    }, props)
  );
}
function AvatarImage(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AvatarPrimitive.Image,
    __spreadValues({
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className)
    }, props)
  );
}
function AvatarFallback(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AvatarPrimitive.Fallback,
    __spreadValues({
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )
    }, props)
  );
}

// src/lib/components/ui/avatar-group.tsx
var React2 = __toESM(require("react"));
var import_jsx_runtime12 = require("react/jsx-runtime");
var AvatarGroup = (_a) => {
  var _b = _a, {
    children,
    max,
    className
  } = _b, props = __objRest(_b, [
    "children",
    "max",
    "className"
  ]);
  const totalAvatars = React2.Children.count(children);
  const displayedAvatars = React2.Children.toArray(children).slice(0, max).reverse();
  const remainingAvatars = max ? Math.max(totalAvatars - max, 1) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "div",
    __spreadProps(__spreadValues({
      className: cn("flex items-center flex-row-reverse", className)
    }, props), {
      children: [
        remainingAvatars > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Avatar, { className: "-ml-2 hover:z-10 relative ring-2 ring-background", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(AvatarFallback, { className: "bg-muted-foreground text-white", children: [
          "+",
          remainingAvatars
        ] }) }),
        displayedAvatars.map((avatar, index) => {
          if (!React2.isValidElement(avatar)) return null;
          return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "-ml-2 hover:z-10 relative", children: React2.cloneElement(avatar, {
            className: "ring-2 ring-background"
          }) }, index);
        })
      ]
    })
  );
};

// src/lib/components/ui/select.tsx
var SelectPrimitive = __toESM(require("@radix-ui/react-select"));
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime13 = require("react/jsx-runtime");
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
}
function SelectTrigger(_a) {
  var _b = _a, {
    className,
    size = "default",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react4.ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    })
  );
}
function SelectContent(_a) {
  var _b = _a, {
    className,
    children,
    position = "popper"
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "position"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectScrollUpButton, {}),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectScrollDownButton, {})
      ]
    })
  ) });
}
function SelectItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react4.CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SelectPrimitive.ItemText, { children })
      ]
    })
  );
}
function SelectScrollUpButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react4.ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react4.ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/lib/calendar/header/user-select.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function UserSelect() {
  const { users, selectedUserId, filterEventsBySelectedUser } = useCalendar();
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Select, { value: selectedUserId, onValueChange: filterEventsBySelectedUser, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SelectValue, { placeholder: "Select a user" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(SelectContent, { align: "end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(SelectItem, { value: "all", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AvatarGroup, { className: "mx-2 flex items-center", max: 3, children: users.map((user) => {
          var _a;
          return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Avatar, { className: "size-6 text-xxs", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              AvatarImage,
              {
                src: (_a = user.picturePath) != null ? _a : void 0,
                alt: user.name
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AvatarFallback, { className: "text-xxs", children: user.name[0] })
          ] }, user.id);
        }) }),
        "All"
      ] }),
      users.map((user) => {
        var _a;
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          SelectItem,
          {
            value: user.id,
            className: "flex-1 cursor-pointer",
            children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Avatar, { className: "size-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                  AvatarImage,
                  {
                    src: (_a = user.picturePath) != null ? _a : void 0,
                    alt: user.name
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AvatarFallback, { className: "text-xxs", children: user.name[0] })
              ] }, user.id),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "truncate", children: user.name })
            ] })
          },
          user.id
        );
      })
    ] })
  ] });
}

// src/lib/calendar/settings/settings.tsx
var import_lucide_react5 = require("lucide-react");

// src/lib/components/ui/switch.tsx
var SwitchPrimitive = __toESM(require("@radix-ui/react-switch"));
var import_jsx_runtime15 = require("react/jsx-runtime");
function Switch(_a) {
  var _b = _a, {
    className,
    icon,
    thumbClassName
  } = _b, props = __objRest(_b, [
    "className",
    "icon",
    "thumbClassName"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      className: cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        SwitchPrimitive.Thumb,
        {
          className: cn(
            "pointer-events-none flex h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 items-center justify-center data-[state=checked]:translate-x-5",
            thumbClassName
          ),
          children: icon ? icon : null
        }
      )
    })
  );
}

// src/lib/calendar/settings/settings.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    agendaModeGroupBy,
    setAgendaModeGroupBy
  } = useCalendar();
  const isDotVariant = badgeVariant === "dot";
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react5.SettingsIcon, {}) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuContent, { className: "w-56", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuLabel, { children: "Calendar settings" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuSeparator, {}),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuGroup, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuItem, { children: [
          "Use dot badge",
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuShortcut, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            Switch,
            {
              icon: isDotVariant ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react5.DotIcon, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react5.PaletteIcon, { className: "w-4 h-4" }),
              checked: isDotVariant,
              onCheckedChange: (checked) => setBadgeVariant(checked ? "dot" : "colored")
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuItem, { children: [
          "Use 24 hour format",
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuShortcut, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            Switch,
            {
              icon: use24HourFormat ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: 24,
                  height: 24,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "icon icon-tabler icons-tabler-outline icon-tabler-clock-24",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("title", { children: "24 Hour Format" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M3 12a9 9 0 0 0 5.998 8.485m12.002 -8.485a9 9 0 1 0 -18 0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M12 7v5" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M18 15v2a1 1 0 0 0 1 1h1" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M21 15v6" })
                  ]
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: 24,
                  height: 24,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "icon icon-tabler icons-tabler-outline icon-tabler-clock-12",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("title", { children: "12 Hour Format" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M3 12a9 9 0 0 0 9 9m9 -9a9 9 0 1 0 -18 0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M12 7v5l.5 .5" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M15 21v-6" })
                  ]
                }
              ),
              checked: use24HourFormat,
              onCheckedChange: toggleTimeFormat
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuSeparator, {}),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuGroup, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuLabel, { children: "Agenda view group by" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
          DropdownMenuRadioGroup,
          {
            value: agendaModeGroupBy,
            onValueChange: (value) => setAgendaModeGroupBy(value),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuRadioItem, { value: "date", children: "Date" }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuRadioItem, { value: "color", children: "Color" })
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/lib/calendar/header/view-tabs.tsx
var import_react5 = require("motion/react");

// src/lib/components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"));
var import_jsx_runtime17 = require("react/jsx-runtime");
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    TabsPrimitive.Root,
    __spreadValues({
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className)
    }, props)
  );
}
function TabsList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    TabsPrimitive.List,
    __spreadValues({
      "data-slot": "tabs-list",
      className: cn(
        "border text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )
    }, props)
  );
}
function TabsTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}

// src/lib/calendar/header/view-tabs.tsx
var import_lucide_react6 = require("lucide-react");
var import_react6 = require("react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var tabs = [
  {
    name: "Agenda",
    value: "agenda",
    icon: () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react6.CalendarRange, { className: "h-4 w-4" })
  },
  {
    name: "Day",
    value: "day",
    icon: () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react6.List, { className: "h-4 w-4" })
  },
  {
    name: "Week",
    value: "week",
    icon: () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react6.Columns, { className: "h-4 w-4" })
  },
  {
    name: "Month",
    value: "month",
    icon: () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react6.Grid3X3, { className: "h-4 w-4" })
  },
  {
    name: "Year",
    value: "year",
    icon: () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react6.Grid2X2, { className: "h-4 w-4" })
  }
];
function Views() {
  const { view, setView } = useCalendar();
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    Tabs,
    {
      value: view,
      onValueChange: (value) => setView(value),
      className: "gap-4 sm:w-auto w-full",
      children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TabsList, { className: "h-auto gap-2 rounded-xl p-1 w-full", children: tabs.map(({ icon: Icon2, name, value }) => {
        const isActive = view === value;
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          import_react5.motion.div,
          {
            layout: true,
            className: cn(
              "flex h-8 items-center justify-center overflow-hidden rounded-md",
              isActive ? "flex-1" : "flex-none"
            ),
            onClick: () => setView(value),
            initial: false,
            animate: {
              width: isActive ? 120 : 32
            },
            transition: {
              type: "tween",
              stiffness: 400,
              damping: 25
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TabsTrigger, { value, asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
              import_react5.motion.div,
              {
                className: "flex h-8 w-full items-center justify-center cursor-pointer",
                animate: { filter: "blur(0px)" },
                exit: { filter: "blur(2px)" },
                transition: { duration: 0.25, ease: "easeOut" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon2, {}),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_react5.AnimatePresence, { initial: false, children: isActive && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    import_react5.motion.span,
                    {
                      className: "font-medium",
                      initial: { opacity: 0, scaleX: 0.8 },
                      animate: { opacity: 1, scaleX: 1 },
                      transition: { duration: 0.25, ease: "easeOut" },
                      style: { originX: 0 },
                      children: name
                    }
                  ) })
                ]
              }
            ) })
          },
          value
        );
      }) })
    }
  );
}
var view_tabs_default = (0, import_react6.memo)(Views);

// src/lib/calendar/header/calendar-header.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
function CalendarHeader() {
  const { view, events, onRequestAddEvent } = useCalendar();
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      import_framer_motion3.motion.div,
      {
        className: "flex items-center gap-3",
        variants: slideFromLeft,
        initial: "initial",
        animate: "animate",
        transition,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TodayButton, {}),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DateNavigator, { view, events })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      import_framer_motion3.motion.div,
      {
        className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5",
        variants: slideFromRight,
        initial: "initial",
        animate: "animate",
        transition,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "options flex-wrap flex items-center gap-4 md:gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(FilterEvents, {}),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(view_tabs_default, {})
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(UserSelect, {}),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(Button, { onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({}), children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react7.Plus, { className: "h-4 w-4" }),
              "Add Event"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Settings, {})
        ]
      }
    )
  ] });
}

// src/lib/calendar/calendar-body.tsx
var import_date_fns15 = require("date-fns");
var import_framer_motion11 = require("framer-motion");

// src/lib/calendar/views/agenda-view/agenda-events.tsx
var import_date_fns4 = require("date-fns");

// src/lib/components/ui/command.tsx
var import_cmdk = require("cmdk");
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime20 = require("react/jsx-runtime");
function Command(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    import_cmdk.Command,
    __spreadValues({
      "data-slot": "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )
    }, props)
  );
}
function CommandInput(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border rounded-md px-3",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react8.SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          import_cmdk.Command.Input,
          __spreadValues({
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            )
          }, props)
        )
      ]
    }
  );
}
function CommandList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    import_cmdk.Command.List,
    __spreadValues({
      "data-slot": "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )
    }, props)
  );
}
function CommandEmpty(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    import_cmdk.Command.Empty,
    __spreadValues({
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm"
    }, props)
  );
}
function CommandGroup(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    import_cmdk.Command.Group,
    __spreadValues({
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )
    }, props)
  );
}
function CommandItem(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    import_cmdk.Command.Item,
    __spreadValues({
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}

// src/lib/calendar/views/month-view/event-bullet.tsx
var import_class_variance_authority4 = require("class-variance-authority");
var import_framer_motion4 = require("framer-motion");
var import_jsx_runtime21 = require("react/jsx-runtime");
var eventBulletVariants = (0, import_class_variance_authority4.cva)("size-2 rounded-full", {
  variants: {
    color: {
      blue: "bg-blue-600 dark:bg-blue-500",
      green: "bg-green-600 dark:bg-green-500",
      red: "bg-red-600 dark:bg-red-500",
      yellow: "bg-yellow-600 dark:bg-yellow-500",
      purple: "bg-purple-600 dark:bg-purple-500",
      orange: "bg-orange-600 dark:bg-orange-500",
      gray: "bg-gray-600 dark:bg-gray-500"
    }
  },
  defaultVariants: {
    color: "blue"
  }
});
function EventBullet({
  color,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_framer_motion4.motion.div,
    {
      className: cn(eventBulletVariants({ color, className })),
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      whileHover: { scale: 1.2 },
      transition
    }
  );
}

// src/lib/calendar/views/agenda-view/agenda-events.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
var AgendaEvents = () => {
  const {
    events,
    use24HourFormat,
    badgeVariant,
    agendaModeGroupBy,
    selectedDate,
    onRequestShowEvent
  } = useCalendar();
  const monthEvents = getEventsForMonth(events, selectedDate);
  const agendaEvents = Object.groupBy(monthEvents, (event) => {
    return agendaModeGroupBy === "date" ? (0, import_date_fns4.format)((0, import_date_fns4.parseISO)(event.startDate), "yyyy-MM-dd") : event.color;
  });
  const groupedAndSortedEvents = Object.entries(agendaEvents).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Command, { className: "py-4 h-[80vh] bg-transparent", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "mb-4 mx-4", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(CommandInput, { placeholder: "Type a command or search..." }) }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(CommandList, { className: "max-h-max px-3 border-t", children: [
      groupedAndSortedEvents.map(([date, groupedEvents]) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        CommandGroup,
        {
          heading: agendaModeGroupBy === "date" ? (0, import_date_fns4.format)((0, import_date_fns4.parseISO)(date), "EEEE, MMMM d, yyyy") : toCapitalize(groupedEvents[0].color),
          children: groupedEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            CommandItem,
            {
              className: cn(
                "mb-2 p-4 border rounded-md data-[selected=true]:bg-bg transition-all data-[selected=true]:text-none hover:cursor-pointer",
                {
                  [getColorClass(event.color)]: badgeVariant === "colored",
                  "hover:bg-zinc-200 dark:hover:bg-gray-900": badgeVariant === "dot",
                  "hover:opacity-60": badgeVariant === "colored"
                }
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "w-full flex items-center justify-between gap-4 cursor-pointer", onClick: () => onRequestShowEvent == null ? void 0 : onRequestShowEvent({ event }), children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "flex items-center gap-2", children: [
                  badgeVariant === "dot" ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(EventBullet, { color: event.color }) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Avatar, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(AvatarImage, { src: "", alt: "@shadcn" }),
                    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(AvatarFallback, { className: getBgColor(event.color), children: getFirstLetters(event.title) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                      "p",
                      {
                        className: cn({
                          "font-medium": badgeVariant === "dot",
                          "text-foreground": badgeVariant === "dot"
                        }),
                        children: event.title
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-muted-foreground text-sm line-clamp-1 text-ellipsis md:text-clip w-1/3", children: event.description })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "w-40 flex justify-center items-center gap-1", children: agendaModeGroupBy === "date" ? /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm", children: formatTime(event.startDate, use24HourFormat) }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-muted-foreground", children: "-" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm", children: formatTime(event.endDate, use24HourFormat) })
                ] }) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm", children: (0, import_date_fns4.format)(event.startDate, "MM/dd/yyyy") }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-sm", children: "at" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm", children: formatTime(event.startDate, use24HourFormat) })
                ] }) })
              ] })
            },
            event.id
          ))
        },
        date
      )),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(CommandEmpty, { children: "No results found." })
    ] })
  ] });
};

// src/lib/calendar/views/month-view/calendar-month-view.tsx
var import_framer_motion7 = require("framer-motion");
var import_react8 = require("react");

// src/lib/calendar/views/month-view/day-cell.tsx
var import_class_variance_authority6 = require("class-variance-authority");
var import_date_fns6 = require("date-fns");
var import_framer_motion6 = require("framer-motion");
var import_react7 = require("react");

// src/lib/calendar/dnd/droppable-area.tsx
var import_jsx_runtime23 = require("react/jsx-runtime");
function DroppableArea({
  date,
  hour,
  minute,
  children,
  className
}) {
  const { handleEventDrop, isDragging } = useDragDrop();
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "div",
    {
      role: "gridcell",
      "aria-label": "Droppable area",
      tabIndex: -1,
      className: `${className || ""} ${isDragging ? "drop-target" : ""}`,
      onDragOver: (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-primary/10");
      },
      onDragLeave: (e) => {
        e.currentTarget.classList.remove("bg-primary/10");
      },
      onDrop: (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-primary/10");
        handleEventDrop(date, hour, minute);
      },
      children
    }
  );
}

// src/lib/calendar/views/month-view/month-event-badge.tsx
var import_class_variance_authority5 = require("class-variance-authority");
var import_date_fns5 = require("date-fns");

// src/lib/calendar/dnd/draggable-event.tsx
var import_framer_motion5 = require("framer-motion");
var import_jsx_runtime24 = require("react/jsx-runtime");
function DraggableEvent({
  event,
  children,
  className
}) {
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();
  const isCurrentlyDragged = isDragging && (draggedEvent == null ? void 0 : draggedEvent.id) === event.id;
  const handleClick = (e) => {
    e.stopPropagation();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_framer_motion5.motion.div,
    {
      className: `${className || ""} ${isCurrentlyDragged ? "opacity-50 cursor-grabbing" : "cursor-grab"}`,
      draggable: true,
      onClick: (e) => handleClick(e),
      onDragStart: (e) => {
        e.dataTransfer.setData(
          "text/plain",
          event.id.toString()
        );
        startDrag(event);
      },
      onDragEnd: () => {
        endDrag();
      },
      children
    }
  );
}

// src/lib/calendar/views/month-view/month-event-badge.tsx
var import_jsx_runtime25 = require("react/jsx-runtime");
var eventBadgeVariants = (0, import_class_variance_authority5.cva)(
  "flex w-full h-6.5 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs cursor-grab",
  {
    variants: {
      color: {
        // Colored variants
        blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
        green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
        red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
        purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
        orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
        // Dot variants
        "blue-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-blue-600",
        "green-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-green-600",
        "red-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-red-600",
        "orange-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-orange-600",
        "purple-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-purple-600",
        "yellow-dot": "bg-bg-secondary text-t-primary [&_svg]:fill-yellow-600"
      },
      multiDayPosition: {
        first: "relative z-10 mr-0 rounded-r-none border-r-0 [&>span]:mr-2.5",
        middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
        last: "ml-0 rounded-l-none border-l-0",
        none: ""
      }
    },
    defaultVariants: {
      color: "blue-dot"
    }
  }
);
function MonthEventBadge({
  event,
  cellDate,
  eventCurrentDay,
  eventTotalDays,
  className,
  position: propPosition
}) {
  const { badgeVariant, use24HourFormat, onRequestShowEvent } = useCalendar();
  const itemStart = (0, import_date_fns5.startOfDay)((0, import_date_fns5.parseISO)(event.startDate));
  const itemEnd = (0, import_date_fns5.endOfDay)((0, import_date_fns5.parseISO)(event.endDate));
  if (cellDate < itemStart || cellDate > itemEnd) return null;
  let position;
  if (propPosition) {
    position = propPosition;
  } else if (eventCurrentDay && eventTotalDays) {
    position = "none";
  } else if ((0, import_date_fns5.isSameDay)(itemStart, itemEnd)) {
    position = "none";
  } else if ((0, import_date_fns5.isSameDay)(cellDate, itemStart)) {
    position = "first";
  } else if ((0, import_date_fns5.isSameDay)(cellDate, itemEnd)) {
    position = "last";
  } else {
    position = "middle";
  }
  const renderBadgeText = ["first", "none"].includes(position);
  const renderBadgeTime = ["last", "none"].includes(position);
  const color = badgeVariant === "dot" ? `${event.color}-dot` : event.color;
  const eventBadgeClasses = cn(
    eventBadgeVariants({ color, multiDayPosition: position, className })
  );
  const marginClass = {
    first: "ml-1 mr-0",
    middle: "mx-0",
    last: "ml-0 mr-1",
    none: "mx-1"
  }[position || "none"];
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DraggableEvent, { event, className: marginClass, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("button", { type: "button", className: eventBadgeClasses, onClick: () => onRequestShowEvent == null ? void 0 : onRequestShowEvent({ event }), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex items-center gap-1.5 truncate", children: [
      !["middle", "last"].includes(position) && badgeVariant === "dot" && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(EventBullet, { color: event.color }),
      renderBadgeText && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("p", { className: "flex-1 truncate font-semibold", children: [
        eventCurrentDay && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { className: "text-xs", children: [
          "Day ",
          eventCurrentDay,
          " of ",
          eventTotalDays,
          " \u2022",
          " "
        ] }),
        event.title
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "hidden sm:block", children: renderBadgeTime && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { children: formatTime(new Date(event.startDate), use24HourFormat) }) })
  ] }) });
}

// src/lib/calendar/views/month-view/day-cell.tsx
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime26 = require("react/jsx-runtime");
var dayCellVariants = (0, import_class_variance_authority6.cva)("text-white", {
  variants: {
    color: {
      blue: "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 ",
      green: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400",
      red: "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400",
      yellow: "bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-400",
      purple: "bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-400",
      orange: "bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-400",
      gray: "bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400"
    }
  },
  defaultVariants: {
    color: "blue"
  }
});
var MAX_VISIBLE_EVENTS = 3;
function DayCell({ cell, events, eventPositions }) {
  const { day, currentMonth, date } = cell;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { onRequestAddEvent, onRequestViewDayEvents } = useCalendar();
  const { cellEvents, currentCellMonth } = (0, import_react7.useMemo)(() => {
    const cellEvents2 = getMonthCellEvents(date, events, eventPositions);
    const currentCellMonth2 = (0, import_date_fns6.startOfDay)(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
    return { cellEvents: cellEvents2, currentCellMonth: currentCellMonth2 };
  }, [date, events, eventPositions]);
  const renderEventAtPosition = (0, import_react7.useCallback)(
    (position) => {
      const event = cellEvents.find((e) => e.position === position);
      if (!event) {
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          import_framer_motion6.motion.div,
          {
            className: "lg:flex-1",
            initial: false,
            animate: false
          },
          `empty-${position}`
        );
      }
      const showBullet = (0, import_date_fns6.isSameMonth)(
        new Date(event.startDate),
        currentCellMonth
      );
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
        import_framer_motion6.motion.div,
        {
          className: "lg:flex-1",
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          transition: __spreadValues({ delay: position * 0.1 }, transition),
          children: [
            showBullet && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(EventBullet, { className: "lg:hidden", color: event.color }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              MonthEventBadge,
              {
                className: "hidden lg:flex",
                event,
                cellDate: (0, import_date_fns6.startOfDay)(date)
              }
            )
          ]
        },
        `event-${event.id}-${position}`
      );
    },
    [cellEvents, currentCellMonth, date]
  );
  const showMoreCount = cellEvents.length - MAX_VISIBLE_EVENTS;
  const showMobileMore = isMobile && currentMonth && showMoreCount > 0;
  const showDesktopMore = !isMobile && currentMonth && showMoreCount > 0;
  const cellContent = (0, import_react7.useMemo)(
    () => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      import_framer_motion6.motion.div,
      {
        className: cn(
          "flex h-full lg:min-h-40 flex-col gap-1 border-l border-t",
          (0, import_date_fns6.isSunday)(date) && "border-l-0"
        ),
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition,
        children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DroppableArea, { date, className: "w-full h-full py-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            import_framer_motion6.motion.span,
            {
              className: cn(
                "h-6 px-1 text-xs font-semibold lg:px-2",
                !currentMonth && "opacity-20",
                (0, import_date_fns6.isToday)(date) && "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground"
              ),
              children: day
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            import_framer_motion6.motion.div,
            {
              className: cn(
                "flex h-fit gap-1 px-2 mt-1 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
                !currentMonth && "opacity-50"
              ),
              children: cellEvents.length === 0 && !isMobile ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "w-full h-full flex justify-center items-center group", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                Button,
                {
                  variant: "ghost",
                  className: "border opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({ startDate: date }),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Plus, { className: "h-4 w-4" }),
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "max-sm:hidden", children: "Add Event" })
                  ]
                }
              ) }) : [0, 1, 2].map(renderEventAtPosition)
            }
          ),
          showMobileMore && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "flex justify-end items-end mx-2", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "text-[0.6rem] font-semibold text-accent-foreground", children: [
            "+",
            showMoreCount
          ] }) }),
          showDesktopMore && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            import_framer_motion6.motion.div,
            {
              className: cn(
                "h-4.5 px-1.5 my-2 text-end text-xs font-semibold text-muted-foreground",
                !currentMonth && "opacity-50"
              ),
              initial: { opacity: 0, y: 5 },
              animate: { opacity: 1, y: 0 },
              transition: __spreadValues({ delay: 0.3 }, transition),
              children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                "span",
                {
                  className: "cursor-pointer",
                  onClick: () => onRequestViewDayEvents == null ? void 0 : onRequestViewDayEvents({ date }),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "sm:hidden", children: [
                      "+",
                      showMoreCount
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "hidden sm:inline py-0.5 px-2 my-1 rounded-xl border", children: [
                      showMoreCount,
                      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "mx-1", children: "more..." })
                    ] })
                  ]
                }
              )
            }
          )
        ] })
      }
    ),
    [
      date,
      day,
      currentMonth,
      cellEvents,
      showMobileMore,
      showDesktopMore,
      showMoreCount,
      renderEventAtPosition,
      isMobile,
      onRequestAddEvent,
      onRequestViewDayEvents
    ]
  );
  if (isMobile && currentMonth) {
    return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { onClick: () => onRequestViewDayEvents == null ? void 0 : onRequestViewDayEvents({ date }), children: cellContent });
  }
  return cellContent;
}

// src/lib/calendar/views/month-view/calendar-month-view.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
var WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function CalendarMonthView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate } = useCalendar();
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  const cells = (0, import_react8.useMemo)(() => getCalendarCells(selectedDate), [selectedDate]);
  const eventPositions = (0, import_react8.useMemo)(
    () => calculateMonthEventPositions(
      multiDayEvents,
      singleDayEvents,
      selectedDate
    ),
    [multiDayEvents, singleDayEvents, selectedDate]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_framer_motion7.motion.div, { initial: "initial", animate: "animate", variants: staggerContainer, children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "grid grid-cols-7", children: WEEK_DAYS.map((day, index) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      import_framer_motion7.motion.div,
      {
        className: "flex items-center justify-center py-2",
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: __spreadValues({ delay: index * 0.05 }, transition),
        children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "text-xs font-medium text-t-quaternary", children: day })
      },
      day
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "grid grid-cols-7 overflow-hidden", children: cells.map((cell) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      DayCell,
      {
        cell,
        events: allEvents,
        eventPositions
      },
      cell.date.toISOString()
    )) })
  ] });
}

// src/lib/calendar/views/week-and-day-view/calendar-day-view.tsx
var import_date_fns11 = require("date-fns");
var import_lucide_react11 = require("lucide-react");
var import_react11 = require("react");

// src/lib/components/ui/day-picker.tsx
var import_lucide_react10 = require("lucide-react");
var import_react_day_picker = require("react-day-picker");
var import_jsx_runtime28 = require("react/jsx-runtime");
function DayPicker(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays"
  ]);
  const defaultClassNames = (0, import_react_day_picker.getDefaultClassNames)();
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    import_react_day_picker.DayPicker,
    __spreadValues({
      showOutsideDays,
      className: cn("p-3", className),
      classNames: __spreadValues({
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        month_caption: cn(
          "relative flex h-7 items-center justify-center",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-sm font-medium",
          defaultClassNames.caption_label
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full justify-between z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_next
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground w-9 font-normal text-[0.8rem]",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
          defaultClassNames.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
          defaultClassNames.day_button
        ),
        range_end: "day-range-end",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "text-red-600 font-bold",
        outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        chevron: cn("fill-muted-foreground", defaultClassNames.chevron)
      }, classNames),
      components: {
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react10.ChevronLeft, { className: "h-4 w-4" });
          }
          return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react10.ChevronRight, { className: "h-4 w-4" });
        }
      }
    }, props)
  );
}
DayPicker.displayName = "DayPicker";

// src/lib/components/ui/scroll-area.tsx
var ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"));
var import_jsx_runtime29 = require("react/jsx-runtime");
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ScrollBar, {}),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ScrollAreaPrimitive.Corner, {})
      ]
    })
  );
}
function ScrollBar(_a) {
  var _b = _a, {
    className,
    orientation = "vertical"
  } = _b, props = __objRest(_b, [
    "className",
    "orientation"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    })
  );
}

// src/lib/calendar/views/week-and-day-view/calendar-time-line.tsx
var import_react9 = require("react");
var import_jsx_runtime30 = require("react/jsx-runtime");
function CalendarTimeline() {
  const { use24HourFormat } = useCalendar();
  const [currentTime, setCurrentTime] = (0, import_react9.useState)(/* @__PURE__ */ new Date());
  (0, import_react9.useEffect)(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 60 * 1e3);
    return () => clearInterval(timer);
  }, []);
  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return minutes / 1440 * 100;
  };
  const formatCurrentTime = () => {
    return formatTime(currentTime, use24HourFormat);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
    "div",
    {
      className: "pointer-events-none absolute inset-x-0 z-50 border-t border-primary",
      style: { top: `${getCurrentTimePosition()}%` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "absolute -left-1.5 -top-1.5 size-3 rounded-full bg-primary" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary", children: formatCurrentTime() })
      ]
    }
  );
}

// src/lib/calendar/views/week-and-day-view/day-view-multi-day-events-row.tsx
var import_date_fns7 = require("date-fns");
var import_jsx_runtime31 = require("react/jsx-runtime");
function DayViewMultiDayEventsRow({
  selectedDate,
  multiDayEvents
}) {
  const dayStart = (0, import_date_fns7.startOfDay)(selectedDate);
  const dayEnd = (0, import_date_fns7.endOfDay)(selectedDate);
  const multiDayEventsInDay = multiDayEvents.filter((event) => {
    const eventStart = (0, import_date_fns7.parseISO)(event.startDate);
    const eventEnd = (0, import_date_fns7.parseISO)(event.endDate);
    return (0, import_date_fns7.isWithinInterval)(dayStart, { start: eventStart, end: eventEnd }) || (0, import_date_fns7.isWithinInterval)(dayEnd, { start: eventStart, end: eventEnd }) || eventStart <= dayStart && eventEnd >= dayEnd;
  }).sort((a, b) => {
    const durationA = (0, import_date_fns7.differenceInDays)(
      (0, import_date_fns7.parseISO)(a.endDate),
      (0, import_date_fns7.parseISO)(a.startDate)
    );
    const durationB = (0, import_date_fns7.differenceInDays)(
      (0, import_date_fns7.parseISO)(b.endDate),
      (0, import_date_fns7.parseISO)(b.startDate)
    );
    return durationB - durationA;
  });
  if (multiDayEventsInDay.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex border-b", children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "w-18" }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "flex flex-1 flex-col gap-1 border-l py-1", children: multiDayEventsInDay.map((event) => {
      const eventStart = (0, import_date_fns7.startOfDay)((0, import_date_fns7.parseISO)(event.startDate));
      const eventEnd = (0, import_date_fns7.startOfDay)((0, import_date_fns7.parseISO)(event.endDate));
      const currentDate = (0, import_date_fns7.startOfDay)(selectedDate);
      const eventTotalDays = (0, import_date_fns7.differenceInDays)(eventEnd, eventStart) + 1;
      const eventCurrentDay = (0, import_date_fns7.differenceInDays)(currentDate, eventStart) + 1;
      return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        MonthEventBadge,
        {
          event,
          cellDate: selectedDate,
          eventCurrentDay,
          eventTotalDays
        },
        event.id
      );
    }) })
  ] });
}

// src/lib/calendar/views/week-and-day-view/render-grouped-events.tsx
var import_date_fns10 = require("date-fns");

// src/lib/calendar/views/week-and-day-view/event-block.tsx
var import_class_variance_authority7 = require("class-variance-authority");
var import_date_fns9 = require("date-fns");

// src/lib/calendar/dnd/resizable-event.tsx
var import_date_fns8 = require("date-fns");
var import_framer_motion8 = require("framer-motion");
var import_re_resizable = require("re-resizable");
var import_react10 = require("react");
var import_jsx_runtime32 = require("react/jsx-runtime");
var PIXELS_PER_HOUR = 96;
var MINUTES_PER_PIXEL = 60 / PIXELS_PER_HOUR;
var MIN_DURATION = 15;
function ResizableEvent({
  event,
  children,
  className
}) {
  const { updateEvent, use24HourFormat } = useCalendar();
  const [isResizing, setIsResizing] = (0, import_react10.useState)(false);
  const [resizePreview, setResizePreview] = (0, import_react10.useState)(null);
  const start = (0, import_react10.useMemo)(() => (0, import_date_fns8.parseISO)(event.startDate), [event.startDate]);
  const end = (0, import_react10.useMemo)(() => (0, import_date_fns8.parseISO)(event.endDate), [event.endDate]);
  const durationInMinutes = (0, import_react10.useMemo)(
    () => (0, import_date_fns8.differenceInMinutes)(end, start),
    [start, end]
  );
  const resizeBoundaries = (0, import_react10.useMemo)(() => {
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);
    return { dayStart, dayEnd };
  }, [start]);
  const handleResizeStart = (0, import_react10.useCallback)(() => {
    setIsResizing(true);
  }, []);
  const handleResize = (0, import_react10.useCallback)(
    (_, direction, ref) => {
      const newHeight = parseInt(ref.style.height, 10);
      const newDuration = Math.max(
        MIN_DURATION,
        Math.round((newHeight + 8) * MINUTES_PER_PIXEL)
      );
      const delta = newDuration - durationInMinutes;
      let newStart = start;
      let newEnd = end;
      if (direction.includes("top")) {
        newStart = (0, import_date_fns8.addMinutes)(start, -delta);
      } else if (direction.includes("bottom")) {
        newEnd = (0, import_date_fns8.addMinutes)(end, delta);
      }
      if ((0, import_date_fns8.isBefore)(newStart, resizeBoundaries.dayStart)) {
        newStart = resizeBoundaries.dayStart;
      }
      if ((0, import_date_fns8.isAfter)(newEnd, resizeBoundaries.dayEnd)) {
        newEnd = resizeBoundaries.dayEnd;
      }
      setResizePreview({
        start: (0, import_date_fns8.format)(newStart, use24HourFormat ? "HH:mm" : "h:mm a"),
        end: (0, import_date_fns8.format)(newEnd, use24HourFormat ? "HH:mm" : "h:mm a")
      });
      updateEvent == null ? void 0 : updateEvent(__spreadProps(__spreadValues({}, event), {
        startDate: newStart.toISOString(),
        endDate: newEnd.toISOString()
      }));
    },
    [
      start,
      end,
      durationInMinutes,
      resizeBoundaries,
      use24HourFormat,
      updateEvent,
      event
    ]
  );
  const handleResizeStop = (0, import_react10.useCallback)(() => {
    setIsResizing(false);
    setResizePreview(null);
  }, []);
  const resizeConfig = (0, import_react10.useMemo)(
    () => ({
      minHeight: 15,
      maxHeight: 1440,
      enable: {
        top: true,
        bottom: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      },
      handleStyles: {
        top: {
          cursor: "ns-resize",
          height: "8px",
          top: "-4px",
          backgroundColor: "transparent"
        },
        bottom: {
          cursor: "ns-resize",
          height: "8px",
          bottom: "-4px",
          backgroundColor: "transparent"
        }
      },
      handleClasses: {
        top: "transition-colors rounded-sm",
        bottom: "transition-colors rounded-sm"
      },
      onResizeStart: handleResizeStart,
      onResize: handleResize,
      onResizeStop: handleResizeStop,
      className: cn(
        "transition-all duration-200",
        isResizing && "z-50 shadow-lg"
      )
    }),
    [handleResizeStart, handleResize, handleResizeStop, isResizing]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
    import_framer_motion8.motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
      className: cn("relative group", className),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_re_resizable.Resizable, __spreadProps(__spreadValues({}, resizeConfig), { children })),
        isResizing && resizePreview && /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
          import_framer_motion8.motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap",
            children: [
              resizePreview.start,
              " - ",
              resizePreview.end
            ]
          }
        )
      ]
    }
  );
}

// src/lib/calendar/views/week-and-day-view/event-block.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
var calendarWeekEventCardVariants = (0, import_class_variance_authority7.cva)(
  "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-offset-2",
  {
    variants: {
      color: {
        // Colored variants
        blue: "border-blue-200 bg-blue-100/50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950",
        green: "border-green-200 bg-green-100/50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950",
        red: "border-red-200 bg-red-100/50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950",
        yellow: "border-yellow-200 bg-yellow-100/50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950",
        purple: "border-purple-200 bg-purple-100/50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-950",
        orange: "border-orange-200 bg-orange-100/50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300 dark:hover:bg-orange-950",
        // Dot variants
        "blue-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-blue-600 dark:[&_svg]:fill-blue-500",
        "green-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-green-600 dark:[&_svg]:fill-green-500",
        "red-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-red-600 dark:[&_svg]:fill-red-500",
        "orange-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-orange-600 dark:[&_svg]:fill-orange-500",
        "purple-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-purple-600 dark:[&_svg]:fill-purple-500",
        "yellow-dot": "border-border bg-card text-foreground hover:bg-accent [&_svg]:fill-yellow-600 dark:[&_svg]:fill-yellow-500"
      }
    },
    defaultVariants: {
      color: "blue-dot"
    }
  }
);
function EventBlock({ event, className }) {
  const { badgeVariant, use24HourFormat, onRequestShowEvent } = useCalendar();
  const start = (0, import_date_fns9.parseISO)(event.startDate);
  const end = (0, import_date_fns9.parseISO)(event.endDate);
  const durationInMinutes = (0, import_date_fns9.differenceInMinutes)(end, start);
  const heightInPixels = durationInMinutes / 60 * 96 - 8;
  const color = badgeVariant === "dot" ? `${event.color}-dot` : event.color;
  const calendarWeekEventCardClasses = cn(
    calendarWeekEventCardVariants({ color, className }),
    durationInMinutes < 35 && "py-0 justify-center"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(ResizableEvent, { event, children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DraggableEvent, { event, children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
    "button",
    {
      type: "button",
      className: calendarWeekEventCardClasses,
      style: { height: `${heightInPixels}px` },
      onClick: () => onRequestShowEvent == null ? void 0 : onRequestShowEvent({ event }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "flex items-center gap-1.5 truncate", children: [
          badgeVariant === "dot" && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            "svg",
            {
              width: "8",
              height: "8",
              viewBox: "0 0 8 8",
              xmlns: "http://www.w3.org/2000/svg",
              className: "shrink-0",
              "aria-hidden": "true",
              children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("circle", { cx: "4", cy: "4", r: "4" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "truncate font-semibold", children: event.title })
        ] }),
        durationInMinutes > 25 && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("p", { children: [
          formatTime(start, use24HourFormat),
          " -",
          " ",
          formatTime(end, use24HourFormat)
        ] })
      ]
    }
  ) }) });
}

// src/lib/calendar/views/week-and-day-view/render-grouped-events.tsx
var import_jsx_runtime34 = require("react/jsx-runtime");
function RenderGroupedEvents({
  groupedEvents,
  day
}) {
  return groupedEvents.map(
    (group, groupIndex) => group.map((event) => {
      let style = getEventBlockStyle(
        event,
        day,
        groupIndex,
        groupedEvents.length
      );
      const hasOverlap = groupedEvents.some(
        (otherGroup, otherIndex) => otherIndex !== groupIndex && otherGroup.some(
          (otherEvent) => (0, import_date_fns10.areIntervalsOverlapping)(
            {
              start: (0, import_date_fns10.parseISO)(event.startDate),
              end: (0, import_date_fns10.parseISO)(event.endDate)
            },
            {
              start: (0, import_date_fns10.parseISO)(otherEvent.startDate),
              end: (0, import_date_fns10.parseISO)(otherEvent.endDate)
            }
          )
        )
      );
      if (!hasOverlap) style = __spreadProps(__spreadValues({}, style), { width: "100%", left: "0%" });
      return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "absolute p-1", style, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(EventBlock, { event }) }, event.id);
    })
  );
}

// src/lib/calendar/views/week-and-day-view/calendar-day-view.tsx
var import_jsx_runtime35 = require("react/jsx-runtime");
function CalendarDayView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate, setSelectedDate, users, use24HourFormat, onRequestAddEvent } = useCalendar();
  const scrollAreaRef = (0, import_react11.useRef)(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  (0, import_react11.useEffect)(() => {
    const handleDragOver = (e) => {
      if (!scrollAreaRef.current) return;
      const scrollArea = scrollAreaRef.current;
      const rect = scrollArea.getBoundingClientRect();
      const scrollSpeed = 15;
      const scrollContainer = scrollArea.querySelector("[data-radix-scroll-area-viewport]") || scrollArea;
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
  const getCurrentEvents = (events) => {
    const now = /* @__PURE__ */ new Date();
    return events.filter(
      (event) => (0, import_date_fns11.isWithinInterval)(now, {
        start: (0, import_date_fns11.parseISO)(event.startDate),
        end: (0, import_date_fns11.parseISO)(event.endDate)
      })
    ) || [];
  };
  const currentEvents = getCurrentEvents(singleDayEvents);
  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = (0, import_date_fns11.parseISO)(event.startDate);
    return eventDate.getDate() === selectedDate.getDate() && eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
  });
  const groupedEvents = groupEvents(dayEvents);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          DayViewMultiDayEventsRow,
          {
            selectedDate,
            multiDayEvents
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "relative z-20 flex border-b", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "w-18" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "flex-1 border-l py-2 text-center text-xs font-medium text-t-quaternary", children: [
            (0, import_date_fns11.format)(selectedDate, "EE"),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "font-semibold text-t-secondary", children: (0, import_date_fns11.format)(selectedDate, "d") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ScrollArea, { className: "h-[800px]", type: "always", ref: scrollAreaRef, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "relative w-18", children: hours.map((hour, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "relative", style: { height: "96px" }, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "absolute -top-3 right-2 flex h-6 items-center", children: index !== 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "text-xs text-t-quaternary", children: (0, import_date_fns11.format)(
          (/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0),
          use24HourFormat ? "HH:00" : "h a"
        ) }) }) }, hour)) }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "relative flex-1 border-l", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "relative", children: [
            hours.map((hour, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
              "div",
              {
                className: "relative",
                style: { height: "96px" },
                children: [
                  index !== 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 border-b" }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                    DroppableArea,
                    {
                      date: selectedDate,
                      hour,
                      minute: 0,
                      className: "absolute inset-x-0 top-0 h-[48px]",
                      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        "div",
                        {
                          className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary",
                          onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({ startDate: selectedDate, startTime: { hour, minute: 0 } })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary" }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                    DroppableArea,
                    {
                      date: selectedDate,
                      hour,
                      minute: 30,
                      className: "absolute inset-x-0 bottom-0 h-[48px]",
                      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        "div",
                        {
                          className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary",
                          onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({ startDate: selectedDate, startTime: { hour, minute: 30 } })
                        }
                      )
                    }
                  )
                ]
              },
              hour
            )),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              RenderGroupedEvents,
              {
                groupedEvents,
                day: selectedDate
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CalendarTimeline, {})
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "hidden w-72 divide-y border-l md:block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        DayPicker,
        {
          className: "mx-auto w-fit",
          mode: "single",
          selected: selectedDate,
          onSelect: (date) => date && setSelectedDate(date),
          initialFocus: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex-1 space-y-3", children: [
        currentEvents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex items-start gap-2 px-4 pt-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "relative mt-[5px] flex size-2.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "relative inline-flex size-2.5 rounded-full bg-green-600" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "text-sm font-semibold text-t-secondary", children: "Happening now" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "p-4 text-center text-sm italic text-t-tertiary", children: "No appointments or consultations at the moment" }),
        currentEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ScrollArea, { className: "h-[422px] px-4", type: "always", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "space-y-6 pb-4", children: currentEvents.map((event) => {
          const user = users.find((user2) => user2.id === event.user.id);
          return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "line-clamp-2 text-sm font-semibold", children: event.title }),
            user && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react11.User, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "text-sm text-t-tertiary", children: user.name })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react11.Calendar, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "text-sm text-t-tertiary", children: (0, import_date_fns11.format)(new Date(event.startDate), "MMM d, yyyy") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react11.Clock, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "text-sm text-t-tertiary", children: [
                (0, import_date_fns11.format)(
                  (0, import_date_fns11.parseISO)(event.startDate),
                  use24HourFormat ? "HH:mm" : "hh:mm a"
                ),
                " ",
                "-",
                (0, import_date_fns11.format)(
                  (0, import_date_fns11.parseISO)(event.endDate),
                  use24HourFormat ? "HH:mm" : "hh:mm a"
                )
              ] })
            ] })
          ] }, event.id);
        }) }) })
      ] })
    ] })
  ] });
}

// src/lib/calendar/views/week-and-day-view/calendar-week-view.tsx
var import_date_fns13 = require("date-fns");
var import_framer_motion9 = require("framer-motion");

// src/lib/calendar/views/week-and-day-view/week-view-multi-day-events-row.tsx
var import_date_fns12 = require("date-fns");
var import_react12 = require("react");
var import_jsx_runtime36 = require("react/jsx-runtime");
function WeekViewMultiDayEventsRow({
  selectedDate,
  multiDayEvents
}) {
  const weekStart = (0, import_date_fns12.startOfWeek)(selectedDate);
  const weekEnd = (0, import_date_fns12.endOfWeek)(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => (0, import_date_fns12.addDays)(weekStart, i));
  const processedEvents = (0, import_react12.useMemo)(() => {
    return multiDayEvents.map((event) => {
      const start = (0, import_date_fns12.parseISO)(event.startDate);
      const end = (0, import_date_fns12.parseISO)(event.endDate);
      const adjustedStart = (0, import_date_fns12.isBefore)(start, weekStart) ? weekStart : start;
      const adjustedEnd = (0, import_date_fns12.isAfter)(end, weekEnd) ? weekEnd : end;
      const startIndex = (0, import_date_fns12.differenceInDays)(adjustedStart, weekStart);
      const endIndex = (0, import_date_fns12.differenceInDays)(adjustedEnd, weekStart);
      return __spreadProps(__spreadValues({}, event), {
        adjustedStart,
        adjustedEnd,
        startIndex,
        endIndex
      });
    }).sort((a, b) => {
      const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
      if (startDiff !== 0) return startDiff;
      return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
    });
  }, [multiDayEvents, weekStart, weekEnd]);
  const eventRows = (0, import_react12.useMemo)(() => {
    const rows = [];
    processedEvents.forEach((event) => {
      let rowIndex = rows.findIndex(
        (row) => row.every(
          (e) => e.endIndex < event.startIndex || e.startIndex > event.endIndex
        )
      );
      if (rowIndex === -1) {
        rowIndex = rows.length;
        rows.push([]);
      }
      rows[rowIndex].push(event);
    });
    return rows;
  }, [processedEvents]);
  const hasEventsInWeek = (0, import_react12.useMemo)(() => {
    return multiDayEvents.some((event) => {
      const start = (0, import_date_fns12.parseISO)(event.startDate);
      const end = (0, import_date_fns12.parseISO)(event.endDate);
      return (
        // Event starts within the week
        start >= weekStart && start <= weekEnd || // Event ends within the week
        end >= weekStart && end <= weekEnd || // Event spans the entire week
        start <= weekStart && end >= weekEnd
      );
    });
  }, [multiDayEvents, weekStart, weekEnd]);
  if (!hasEventsInWeek) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "overflow-hidden flex", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-18 border-b" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "grid flex-1 grid-cols-7 divide-x border-b border-l", children: weekDays.map((day, dayIndex) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      "div",
      {
        className: "flex h-full flex-col gap-1 py-1",
        children: eventRows.map((row, rowIndex) => {
          const event = row.find(
            (e) => e.startIndex <= dayIndex && e.endIndex >= dayIndex
          );
          if (!event) {
            return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              "div",
              {
                className: "h-6.5"
              },
              `${rowIndex}-${dayIndex.toString()}`
            );
          }
          let position = "none";
          if (dayIndex === event.startIndex && dayIndex === event.endIndex) {
            position = "none";
          } else if (dayIndex === event.startIndex) {
            position = "first";
          } else if (dayIndex === event.endIndex) {
            position = "last";
          } else {
            position = "middle";
          }
          return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            MonthEventBadge,
            {
              event,
              cellDate: (0, import_date_fns12.startOfDay)(day),
              position
            },
            `${event.id}-${dayIndex}`
          );
        })
      },
      day.toISOString()
    )) })
  ] });
}

// src/lib/calendar/views/week-and-day-view/calendar-week-view.tsx
var import_jsx_runtime37 = require("react/jsx-runtime");
function CalendarWeekView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate, use24HourFormat, onRequestAddEvent } = useCalendar();
  const weekStart = (0, import_date_fns13.startOfWeek)(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => (0, import_date_fns13.addDays)(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
    import_framer_motion9.motion.div,
    {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants: fadeIn,
      transition,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
          import_framer_motion9.motion.div,
          {
            className: "flex flex-col items-center justify-center border-b p-4 text-sm sm:hidden",
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { children: "Weekly view is not recommended on smaller devices." }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { children: "Please switch to a desktop device or use the daily view instead." })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_framer_motion9.motion.div, { className: "flex-col sm:flex", variants: staggerContainer, children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              WeekViewMultiDayEventsRow,
              {
                selectedDate,
                multiDayEvents
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
              import_framer_motion9.motion.div,
              {
                className: "relative z-20 flex border-b",
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                transition,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "w-18" }),
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "grid flex-1 grid-cols-7  border-l", children: weekDays.map((day, index) => /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
                    import_framer_motion9.motion.span,
                    {
                      className: "py-1 sm:py-2 text-center text-xs font-medium text-t-quaternary",
                      initial: { opacity: 0, y: -10 },
                      animate: { opacity: 1, y: 0 },
                      transition: __spreadValues({ delay: index * 0.05 }, transition),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("span", { className: "block sm:hidden", children: [
                          (0, import_date_fns13.format)(day, "EEE").charAt(0),
                          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "block font-semibold text-t-secondary text-xs", children: (0, import_date_fns13.format)(day, "d") })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("span", { className: "hidden sm:inline", children: [
                          (0, import_date_fns13.format)(day, "EE"),
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "ml-1 font-semibold text-t-secondary", children: (0, import_date_fns13.format)(day, "d") })
                        ] })
                      ]
                    },
                    day.toISOString()
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(ScrollArea, { className: "h-[736px]", type: "always", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_framer_motion9.motion.div, { className: "relative w-18", variants: staggerContainer, children: hours.map((hour, index) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              import_framer_motion9.motion.div,
              {
                className: "relative",
                style: { height: "96px" },
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: __spreadValues({ delay: index * 0.02 }, transition),
                children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "absolute -top-3 right-2 flex h-6 items-center", children: index !== 0 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "text-xs text-t-quaternary", children: (0, import_date_fns13.format)(
                  (/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0),
                  use24HourFormat ? "HH:00" : "h a"
                ) }) })
              },
              hour
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
              import_framer_motion9.motion.div,
              {
                className: "relative flex-1 border-l",
                variants: staggerContainer,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "grid grid-cols-7 divide-x", children: weekDays.map((day, dayIndex) => {
                    const dayEvents = singleDayEvents.filter(
                      (event) => (0, import_date_fns13.isSameDay)((0, import_date_fns13.parseISO)(event.startDate), day) || (0, import_date_fns13.isSameDay)((0, import_date_fns13.parseISO)(event.endDate), day)
                    );
                    const groupedEvents = groupEvents(dayEvents);
                    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
                      import_framer_motion9.motion.div,
                      {
                        className: "relative",
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: __spreadValues({ delay: dayIndex * 0.1 }, transition),
                        children: [
                          hours.map((hour, index) => /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
                            import_framer_motion9.motion.div,
                            {
                              className: "relative",
                              style: { height: "96px" },
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              transition: __spreadValues({ delay: index * 0.01 }, transition),
                              children: [
                                index !== 0 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 border-b" }),
                                /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                                  DroppableArea,
                                  {
                                    date: day,
                                    hour,
                                    minute: 0,
                                    className: "absolute inset-x-0 top-0  h-[48px]",
                                    children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                                      "div",
                                      {
                                        className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary",
                                        onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({ startDate: day, startTime: { hour, minute: 0 } })
                                      }
                                    )
                                  }
                                ),
                                /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary" }),
                                /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                                  DroppableArea,
                                  {
                                    date: day,
                                    hour,
                                    minute: 30,
                                    className: "absolute inset-x-0 bottom-0 h-[48px]",
                                    children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                                      "div",
                                      {
                                        className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary",
                                        onClick: () => onRequestAddEvent == null ? void 0 : onRequestAddEvent({ startDate: day, startTime: { hour, minute: 30 } })
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            hour
                          )),
                          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                            RenderGroupedEvents,
                            {
                              groupedEvents,
                              day
                            }
                          )
                        ]
                      },
                      day.toISOString()
                    );
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(CalendarTimeline, {})
                ]
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}

// src/lib/calendar/views/year-view/calendar-year-view.tsx
var import_date_fns14 = require("date-fns");
var import_framer_motion10 = require("framer-motion");
var import_jsx_runtime38 = require("react/jsx-runtime");
var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function CalendarYearView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate, setSelectedDate, onRequestViewDayEvents } = useCalendar();
  const currentYear = (0, import_date_fns14.getYear)(selectedDate);
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "flex flex-col h-full  overflow-y-auto p-4  sm:p-6", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
    import_framer_motion10.motion.div,
    {
      initial: "initial",
      animate: "animate",
      variants: staggerContainer,
      className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr",
      children: MONTHS.map((month, monthIndex) => {
        const monthDate = new Date(currentYear, monthIndex, 1);
        const cells = getCalendarCells(monthDate);
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
          import_framer_motion10.motion.div,
          {
            className: "flex flex-col border border-border rounded-lg shadow-sm overflow-hidden",
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: __spreadValues({ delay: monthIndex * 0.05 }, transition),
            "aria-label": `${month} ${currentYear} calendar`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                "button",
                {
                  type: "button",
                  className: "w-full px-3 py-2 text-center font-semibold text-sm sm:text-base cursor-pointer hover:bg-primary/20 transition-colors bg-transparent border-none appearance-none",
                  onClick: () => setSelectedDate(new Date(currentYear, monthIndex, 1)),
                  "aria-label": `Select ${month}`,
                  children: month
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "grid grid-cols-7 text-center text-xs font-medium text-muted-foreground py-2", children: WEEKDAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "p-1", children: day }, day)) }),
              /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "grid grid-cols-7 gap-0.5 p-1.5 flex-grow text-xs", children: cells.map((cell) => {
                const isCurrentMonth = (0, import_date_fns14.isSameMonth)(cell.date, monthDate);
                const isToday2 = (0, import_date_fns14.isSameDay)(cell.date, /* @__PURE__ */ new Date());
                const dayEvents = allEvents.filter(
                  (event) => (0, import_date_fns14.isSameDay)(new Date(event.startDate), cell.date)
                );
                const hasEvents = dayEvents.length > 0;
                return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                  "div",
                  {
                    className: cn(
                      "flex flex-col items-center justify-start p-1 min-h-[2rem] relative",
                      !isCurrentMonth && "text-muted-foreground/40",
                      hasEvents && isCurrentMonth ? "cursor-pointer hover:bg-accent/20 hover:rounded-md" : "cursor-default"
                    ),
                    children: isCurrentMonth && hasEvents ? /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
                      "div",
                      {
                        className: "w-full h-full flex flex-col items-center justify-start gap-0.5",
                        onClick: () => onRequestViewDayEvents == null ? void 0 : onRequestViewDayEvents({ date: cell.date }),
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                            "span",
                            {
                              className: cn(
                                "size-5 flex items-center justify-center font-medium",
                                isToday2 && "rounded-full bg-primary text-primary-foreground"
                              ),
                              children: cell.day
                            }
                          ),
                          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "flex justify-center items-center gap-0.5", children: dayEvents.length <= 2 ? dayEvents.slice(0, 2).map((event) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                            EventBullet,
                            {
                              color: event.color,
                              className: "size-1.5"
                            },
                            event.id
                          )) : /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "flex flex-col justify-center items-center", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                              EventBullet,
                              {
                                color: dayEvents[0].color,
                                className: "size-1.5"
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("span", { className: "text-[0.6rem]", children: [
                              "+",
                              dayEvents.length - 1
                            ] })
                          ] }) })
                        ]
                      }
                    ) : /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "w-full h-full flex flex-col items-center justify-start", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                      "span",
                      {
                        className: cn(
                          "size-5 flex items-center justify-center font-medium"
                        ),
                        children: cell.day
                      }
                    ) })
                  },
                  cell.date.toISOString()
                );
              }) })
            ]
          },
          month
        );
      })
    }
  ) });
}

// src/lib/calendar/calendar-body.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
function CalendarBody() {
  const { view, events } = useCalendar();
  const singleDayEvents = events.filter((event) => {
    const startDate = (0, import_date_fns15.parseISO)(event.startDate);
    const endDate = (0, import_date_fns15.parseISO)(event.endDate);
    return (0, import_date_fns15.isSameDay)(startDate, endDate);
  });
  const multiDayEvents = events.filter((event) => {
    const startDate = (0, import_date_fns15.parseISO)(event.startDate);
    const endDate = (0, import_date_fns15.parseISO)(event.endDate);
    return !(0, import_date_fns15.isSameDay)(startDate, endDate);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "w-full h-full overflow-scroll relative", children: /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
    import_framer_motion11.motion.div,
    {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants: fadeIn,
      transition,
      children: [
        view === "month" && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          CalendarMonthView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "week" && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          CalendarWeekView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "day" && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          CalendarDayView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "year" && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          CalendarYearView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "agenda" && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          import_framer_motion11.motion.div,
          {
            initial: "initial",
            animate: "animate",
            exit: "exit",
            variants: fadeIn,
            transition,
            children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(AgendaEvents, {})
          },
          "agenda"
        )
      ]
    },
    view
  ) });
}

// src/lib/calendar/calendar.tsx
var import_jsx_runtime40 = require("react/jsx-runtime");
function Calendar2({
  events,
  users,
  onEventUpdate,
  onRequestAddEvent,
  onRequestShowEvent,
  onRequestViewDayEvents
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
    CalendarProvider,
    {
      events,
      users,
      view: "month",
      onEventUpdate,
      onRequestAddEvent,
      onRequestShowEvent,
      onRequestViewDayEvents,
      children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(DndProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "w-full border rounded-xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(CalendarHeader, {}),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(CalendarBody, {})
      ] }) })
    }
  );
}

// src/lib/components/ui/skeleton.tsx
var import_jsx_runtime41 = require("react/jsx-runtime");
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/lib/calendar/skeletons/calendar-header-skeleton.tsx
var import_jsx_runtime42 = require("react/jsx-runtime");
function CalendarHeaderSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "flex items-center justify-between border-b px-4 py-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-32" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-24" }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-8" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-24" }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton, { className: "h-8 w-8" })
    ] })
  ] });
}

// src/lib/calendar/skeletons/month-view-skeleton.tsx
var import_jsx_runtime43 = require("react/jsx-runtime");
function MonthViewSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "grid grid-cols-7 border-b py-2", children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(Skeleton, { className: "h-6 w-12" }) }, i)) }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "grid flex-1 grid-cols-7 grid-rows-6", children: Array.from({ length: 42 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "border-b border-r p-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(Skeleton, { className: "mb-1 h-6 w-6 rounded-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "mt-1 space-y-1", children: Array.from({ length: Math.floor(Math.random() * 3) }).map(
        (_2, j) => /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(Skeleton, { className: "h-5 w-full" }, j)
      ) })
    ] }, i)) })
  ] });
}

// src/lib/calendar/skeletons/calendar-skeleton.tsx
var import_jsx_runtime44 = require("react/jsx-runtime");
function CalendarSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "container mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "flex h-screen flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(CalendarHeaderSkeleton, {}),
    /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(MonthViewSkeleton, {}) })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Calendar,
  CalendarSkeleton
});
//# sourceMappingURL=index.js.map
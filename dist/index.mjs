"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/lib/calendar/contexts/calendar-context.tsx
import { createContext, useContext, useState as useState2 } from "react";

// src/lib/calendar/hooks.ts
import { useEffect, useState } from "react";
function useDisclosure({
  defaultIsOpen = false
} = {}) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((currentValue) => !currentValue);
  return { onOpen, onClose, isOpen, onToggle };
}
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
  const [storedValue, setStoredValue] = useState(readValue);
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
  const [matches, setMatches] = useState(false);
  useEffect(() => {
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
import { jsx } from "react/jsx-runtime";
var DEFAULT_SETTINGS = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  agendaModeGroupBy: "date"
};
var CalendarContext = createContext({});
function CalendarProvider({
  children,
  users,
  events,
  badge = "colored",
  view = "day"
}) {
  const [settings, setSettings] = useLocalStorage(
    "calendar-settings",
    __spreadProps(__spreadValues({}, DEFAULT_SETTINGS), {
      badgeVariant: badge,
      view
    })
  );
  const [badgeVariant, setBadgeVariantState] = useState2(
    settings.badgeVariant
  );
  const [currentView, setCurrentViewState] = useState2(
    settings.view
  );
  const [use24HourFormat, setUse24HourFormatState] = useState2(
    settings.use24HourFormat
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState2(settings.agendaModeGroupBy);
  const [selectedDate, setSelectedDate] = useState2(/* @__PURE__ */ new Date());
  const [selectedUserId, setSelectedUserId] = useState2(
    "all"
  );
  const [selectedColors, setSelectedColors] = useState2([]);
  const [allEvents, setAllEvents] = useState2(events || []);
  const [filteredEvents, setFilteredEvents] = useState2(events || []);
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
  const filterEventsBySelectedColors = (color) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected ? selectedColors.filter((c) => c !== color) : [...selectedColors, color];
    if (newColors.length > 0) {
      const filtered = allEvents.filter((event) => {
        const eventColor = event.color || "blue";
        return newColors.includes(eventColor);
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }
    setSelectedColors(newColors);
  };
  const filterEventsBySelectedUser = (userId) => {
    setSelectedUserId(userId);
    if (userId === "all") {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter((event) => event.user.id === userId);
      setFilteredEvents(filtered);
    }
  };
  const handleSelectDate = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };
  const addEvent = (event) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };
  const updateEvent = (event) => {
    const updated = __spreadProps(__spreadValues({}, event), {
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString()
    });
    setAllEvents((prev) => prev.map((e) => e.id === event.id ? updated : e));
    setFilteredEvents(
      (prev) => prev.map((e) => e.id === event.id ? updated : e)
    );
  };
  const removeEvent = (eventId) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };
  const clearFilter = () => {
    setFilteredEvents(allEvents);
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
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter
  };
  return /* @__PURE__ */ jsx(CalendarContext.Provider, { value, children });
}
function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}

// src/lib/calendar/contexts/dnd-context.tsx
import React, {
  createContext as createContext2,
  useCallback,
  useContext as useContext2,
  useRef,
  useState as useState3,
  useMemo
} from "react";
import { toast } from "sonner";
import { jsx as jsx2 } from "react/jsx-runtime";
var DragDropContext = createContext2(
  void 0
);
function DndProvider({ children }) {
  const { updateEvent } = useCalendar();
  const [dragState, setDragState] = useState3({ draggedEvent: null, isDragging: false });
  const onEventDroppedRef = useRef(null);
  const startDrag = useCallback((event) => {
    setDragState({ draggedEvent: event, isDragging: true });
  }, []);
  const endDrag = useCallback(() => {
    setDragState({ draggedEvent: null, isDragging: false });
  }, []);
  const calculateNewDates = useCallback(
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
  const isSamePosition = useCallback((date1, date2) => {
    return date1.getTime() === date2.getTime();
  }, []);
  const handleEventDrop = useCallback(
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
  const handleEventUpdate = useCallback(
    (event, newStartDate, newEndDate) => {
      try {
        const updatedEvent = __spreadProps(__spreadValues({}, event), {
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString()
        });
        updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      } catch (e) {
        toast.error("Failed to update event");
      }
    },
    [updateEvent]
  );
  React.useEffect(() => {
    onEventDroppedRef.current = handleEventUpdate;
  }, [handleEventUpdate]);
  const contextValue = useMemo(
    () => ({
      draggedEvent: dragState.draggedEvent,
      isDragging: dragState.isDragging,
      startDrag,
      endDrag,
      handleEventDrop
    }),
    [dragState, startDrag, endDrag, handleEventDrop]
  );
  return /* @__PURE__ */ jsx2(DragDropContext.Provider, { value: contextValue, children });
}
function useDragDrop() {
  const context = useContext2(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
}

// src/lib/calendar/header/calendar-header.tsx
import { motion as motion4 } from "framer-motion";
import {
  Plus
} from "lucide-react";

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

// src/lib/calendar/dialogs/add-edit-event-dialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format as format2, set } from "date-fns";
import { useEffect as useEffect2, useMemo as useMemo2 } from "react";
import { useForm } from "react-hook-form";
import { toast as toast2 } from "sonner";

// src/lib/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/lib/components/ui/button.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva(
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
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx3(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/lib/components/ui/date-time-picker.tsx
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// src/lib/components/ui/calendar.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { jsx as jsx4 } from "react/jsx-runtime";
function Calendar(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays"
  ]);
  return /* @__PURE__ */ jsx4(
    DayPicker,
    __spreadValues({
      showOutsideDays,
      className: cn("p-3", className),
      classNames: __spreadValues({
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range" ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end: "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible"
      }, classNames),
      components: {
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx4(ChevronLeft, { className: "h-4 w-4" });
          }
          return /* @__PURE__ */ jsx4(ChevronRight, { className: "h-4 w-4" });
        }
      }
    }, props)
  );
}

// src/lib/components/ui/form.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import * as React2 from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState
} from "react-hook-form";

// src/lib/components/ui/label.tsx
import * as LabelPrimitive from "@radix-ui/react-label";
import { jsx as jsx5 } from "react/jsx-runtime";
function Label(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx5(
    LabelPrimitive.Root,
    __spreadValues({
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )
    }, props)
  );
}

// src/lib/components/ui/form.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
var Form = FormProvider;
var FormFieldContext = React2.createContext(
  {}
);
var FormField = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx6(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx6(Controller, __spreadValues({}, props)) });
};
var useFormField = () => {
  const fieldContext = React2.useContext(FormFieldContext);
  const itemContext = React2.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return __spreadValues({
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`
  }, fieldState);
};
var FormItemContext = React2.createContext(
  {}
);
function FormItem(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const id = React2.useId();
  return /* @__PURE__ */ jsx6(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx6(
    "div",
    __spreadValues({
      "data-slot": "form-item",
      className: cn("grid gap-2", className)
    }, props)
  ) });
}
function FormLabel(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx6(
    Label,
    __spreadValues({
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId
    }, props)
  );
}
function FormControl(_a) {
  var props = __objRest(_a, []);
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx6(
    Slot2,
    __spreadValues({
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error
    }, props)
  );
}
function FormMessage(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  var _a2;
  const { error, formMessageId } = useFormField();
  const body = error ? String((_a2 = error == null ? void 0 : error.message) != null ? _a2 : "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx6(
    "p",
    __spreadProps(__spreadValues({
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className)
    }, props), {
      children: body
    })
  );
}

// src/lib/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx7 } from "react/jsx-runtime";
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx7(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx7(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
  var _b = _a, {
    className,
    align = "center",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx7(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx7(
    PopoverPrimitive.Content,
    __spreadValues({
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      )
    }, props)
  ) });
}

// src/lib/components/ui/scroll-area.tsx
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { jsx as jsx8, jsxs } from "react/jsx-runtime";
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx8(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx8(ScrollBar, {}),
        /* @__PURE__ */ jsx8(ScrollAreaPrimitive.Corner, {})
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
  return /* @__PURE__ */ jsx8(
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
      children: /* @__PURE__ */ jsx8(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    })
  );
}

// src/lib/components/ui/date-time-picker.tsx
import { jsx as jsx9, jsxs as jsxs2 } from "react/jsx-runtime";
function DateTimePicker({ form, field }) {
  const { use24HourFormat } = useCalendar();
  function handleDateSelect(date) {
    if (date) {
      form.setValue(field.name, date);
    }
  }
  function handleTimeChange(type, value) {
    const currentDate = form.getValues(field.name) || /* @__PURE__ */ new Date();
    const newDate = new Date(currentDate);
    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }
    form.setValue(field.name, newDate);
  }
  return /* @__PURE__ */ jsxs2(FormItem, { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx9(FormLabel, { children: field.name === "startDate" ? "Start Date" : "End Date" }),
    /* @__PURE__ */ jsxs2(Popover, { modal: true, children: [
      /* @__PURE__ */ jsx9(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx9(FormControl, { children: /* @__PURE__ */ jsxs2(
        Button,
        {
          variant: "outline",
          className: cn(
            "w-full pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          ),
          children: [
            field.value ? format(
              field.value,
              use24HourFormat ? "MM/dd/yyyy HH:mm" : "MM/dd/yyyy hh:mm aa"
            ) : /* @__PURE__ */ jsx9("span", { children: "MM/DD/YYYY hh:mm aa" }),
            /* @__PURE__ */ jsx9(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsx9(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsxs2("div", { className: "sm:flex", children: [
        /* @__PURE__ */ jsx9(
          Calendar,
          {
            mode: "single",
            selected: field.value,
            onSelect: handleDateSelect,
            initialFocus: true
          }
        ),
        /* @__PURE__ */ jsxs2("div", { className: "flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x", children: [
          /* @__PURE__ */ jsxs2(ScrollArea, { className: "w-64 sm:w-auto", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex sm:flex-col p-2", children: Array.from(
              { length: use24HourFormat ? 24 : 12 },
              (_, i) => i
            ).map((hour) => /* @__PURE__ */ jsx9(
              Button,
              {
                size: "icon",
                variant: field.value && field.value.getHours() % (use24HourFormat ? 24 : 12) === hour % (use24HourFormat ? 24 : 12) ? "default" : "ghost",
                className: "sm:w-full shrink-0 aspect-square",
                onClick: () => handleTimeChange("hour", hour.toString()),
                children: hour.toString().padStart(2, "0")
              },
              hour
            )) }),
            /* @__PURE__ */ jsx9(ScrollBar, { orientation: "horizontal", className: "sm:hidden" })
          ] }),
          /* @__PURE__ */ jsxs2(ScrollArea, { className: "w-64 sm:w-auto", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex sm:flex-col p-2", children: Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => /* @__PURE__ */ jsx9(
              Button,
              {
                size: "icon",
                variant: field.value && field.value.getMinutes() === minute ? "default" : "ghost",
                className: "sm:w-full shrink-0 aspect-square",
                onClick: () => handleTimeChange("minute", minute.toString()),
                children: minute.toString().padStart(2, "0")
              },
              minute
            )) }),
            /* @__PURE__ */ jsx9(ScrollBar, { orientation: "horizontal", className: "sm:hidden" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx9(FormMessage, {})
  ] });
}

// src/lib/components/ui/input.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx10(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )
    }, props)
  );
}

// src/lib/components/ui/responsive-modal.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva as cva2 } from "class-variance-authority";
import { X } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs3 } from "react/jsx-runtime";
var Modal = DialogPrimitive.Root;
var ModalTrigger = DialogPrimitive.Trigger;
var ModalClose = DialogPrimitive.Close;
var ModalPortal = DialogPrimitive.Portal;
var ModalOverlay = (props) => {
  return /* @__PURE__ */ jsx11(
    DialogPrimitive.Overlay,
    __spreadProps(__spreadValues({}, props), {
      className: cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        props.className
      )
    })
  );
};
var ModalVariants = cva2(
  cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500 overflow-y-auto",
    "lg:left-[50%] lg:top-[50%] lg:w-full lg:max-w-lg lg:translate-x-[-50%] lg:translate-y-[-50%]",
    "lg:border lg:duration-200 lg:data-[state=open]:animate-in lg:data-[state=closed]:animate-out",
    "lg:data-[state=closed]:fade-out-0 lg:data-[state=open]:fade-in-0",
    "lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:zoom-in-95 lg:rounded-xl"
  ),
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b rounded-b-xl max-h-[80dvh] lg:h-fit data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t lg:h-fit max-h-[80dvh] rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full lg:h-fit w-3/4 border-r rounded-r-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full lg:h-fit w-3/4 border-l rounded-l-xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "bottom"
    }
  }
);
var ModalContent = (_a) => {
  var _b = _a, {
    side = "bottom",
    className,
    children
  } = _b, props = __objRest(_b, [
    "side",
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs3(ModalPortal, { children: [
    /* @__PURE__ */ jsx11(ModalOverlay, {}),
    /* @__PURE__ */ jsxs3(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({}, props), {
        "aria-describedby": "responsive-modal-description",
        className: cn(ModalVariants({ side }), className),
        children: [
          children,
          /* @__PURE__ */ jsxs3(ModalClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ jsx11(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx11("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      })
    )
  ] });
};
var ModalHeader = (props) => /* @__PURE__ */ jsx11(
  "div",
  __spreadProps(__spreadValues({}, props), {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      props.className
    )
  })
);
var ModalFooter = (props) => /* @__PURE__ */ jsx11(
  "div",
  __spreadProps(__spreadValues({}, props), {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      props.className
    )
  })
);
var ModalTitle = (props) => /* @__PURE__ */ jsx11(
  DialogPrimitive.Title,
  __spreadProps(__spreadValues({}, props), {
    className: cn("text-lg font-semibold text-foreground", props.className)
  })
);
var ModalDescription = (props) => /* @__PURE__ */ jsx11(
  DialogPrimitive.Description,
  __spreadProps(__spreadValues({}, props), {
    className: cn("text-sm text-muted-foreground", props.className)
  })
);

// src/lib/components/ui/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs4 } from "react/jsx-runtime";
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx12(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx12(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
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
  return /* @__PURE__ */ jsxs4(
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
        /* @__PURE__ */ jsx12(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx12(ChevronDownIcon, { className: "size-4 opacity-50" }) })
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
  return /* @__PURE__ */ jsx12(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs4(
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
        /* @__PURE__ */ jsx12(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx12(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx12(SelectScrollDownButton, {})
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
  return /* @__PURE__ */ jsxs4(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx12("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx12(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx12(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx12(SelectPrimitive.ItemText, { children })
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
  return /* @__PURE__ */ jsx12(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx12(ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx12(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx12(ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/lib/components/ui/textarea.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function Textarea(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx13(
    "textarea",
    __spreadValues({
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )
    }, props)
  );
}

// src/lib/calendar/schemas.ts
import { z } from "zod/v4";
var eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required"),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"])
});

// src/lib/calendar/constants.ts
var COLORS = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange"
];

// src/lib/calendar/dialogs/add-edit-event-dialog.tsx
import { jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
function AddEditEventDialog({
  children,
  startDate,
  startTime,
  event
}) {
  var _a, _b, _c;
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!event;
  const initialDates = useMemo2(() => {
    if (!isEditing && !event) {
      if (!startDate) {
        const now = /* @__PURE__ */ new Date();
        return { startDate: now, endDate: addMinutes(now, 30) };
      }
      const start = startTime ? set(new Date(startDate), {
        hours: startTime.hour,
        minutes: startTime.minute,
        seconds: 0
      }) : new Date(startDate);
      const end = addMinutes(start, 30);
      return { startDate: start, endDate: end };
    }
    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    };
  }, [startDate, startTime, event, isEditing]);
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: (_a = event == null ? void 0 : event.title) != null ? _a : "",
      description: (_b = event == null ? void 0 : event.description) != null ? _b : "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: (_c = event == null ? void 0 : event.color) != null ? _c : "blue"
    }
  });
  useEffect2(() => {
    var _a2, _b2, _c2;
    form.reset({
      title: (_a2 = event == null ? void 0 : event.title) != null ? _a2 : "",
      description: (_b2 = event == null ? void 0 : event.description) != null ? _b2 : "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: (_c2 = event == null ? void 0 : event.color) != null ? _c2 : "blue"
    });
  }, [event, initialDates, form]);
  const onSubmit = (values) => {
    try {
      const formattedEvent = __spreadProps(__spreadValues({}, values), {
        startDate: format2(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format2(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        id: isEditing ? event.id : Math.floor(Math.random() * 1e6),
        user: isEditing ? event.user : {
          id: Math.floor(Math.random() * 1e6).toString(),
          name: "Jeraidi Yassir",
          picturePath: null
        },
        color: values.color
      });
      if (isEditing) {
        updateEvent(formattedEvent);
        toast2.success("Event updated successfully");
      } else {
        addEvent(formattedEvent);
        toast2.success("Event created successfully");
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error(`Error ${isEditing ? "editing" : "adding"} event:`, error);
      toast2.error(`Failed to ${isEditing ? "edit" : "add"} event`);
    }
  };
  return /* @__PURE__ */ jsxs5(Modal, { open: isOpen, onOpenChange: onToggle, modal: false, children: [
    /* @__PURE__ */ jsx14(ModalTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs5(ModalContent, { children: [
      /* @__PURE__ */ jsxs5(ModalHeader, { children: [
        /* @__PURE__ */ jsx14(ModalTitle, { children: isEditing ? "Edit Event" : "Add New Event" }),
        /* @__PURE__ */ jsx14(ModalDescription, { children: isEditing ? "Modify your existing event." : "Create a new event for your calendar." })
      ] }),
      /* @__PURE__ */ jsx14(Form, __spreadProps(__spreadValues({}, form), { children: /* @__PURE__ */ jsxs5(
        "form",
        {
          id: "event-form",
          onSubmit: form.handleSubmit(onSubmit),
          className: "grid gap-4 py-4",
          children: [
            /* @__PURE__ */ jsx14(
              FormField,
              {
                control: form.control,
                name: "title",
                render: ({ field, fieldState }) => /* @__PURE__ */ jsxs5(FormItem, { children: [
                  /* @__PURE__ */ jsx14(FormLabel, { htmlFor: "title", className: "required", children: "Title" }),
                  /* @__PURE__ */ jsx14(FormControl, { children: /* @__PURE__ */ jsx14(
                    Input,
                    __spreadProps(__spreadValues({
                      id: "title",
                      placeholder: "Enter a title"
                    }, field), {
                      className: fieldState.invalid ? "border-red-500" : ""
                    })
                  ) }),
                  /* @__PURE__ */ jsx14(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx14(
              FormField,
              {
                control: form.control,
                name: "startDate",
                render: ({ field }) => /* @__PURE__ */ jsx14(DateTimePicker, { form, field })
              }
            ),
            /* @__PURE__ */ jsx14(
              FormField,
              {
                control: form.control,
                name: "endDate",
                render: ({ field }) => /* @__PURE__ */ jsx14(DateTimePicker, { form, field })
              }
            ),
            /* @__PURE__ */ jsx14(
              FormField,
              {
                control: form.control,
                name: "color",
                render: ({ field, fieldState }) => /* @__PURE__ */ jsxs5(FormItem, { children: [
                  /* @__PURE__ */ jsx14(FormLabel, { className: "required", children: "Variant" }),
                  /* @__PURE__ */ jsx14(FormControl, { children: /* @__PURE__ */ jsxs5(Select, { value: field.value, onValueChange: field.onChange, children: [
                    /* @__PURE__ */ jsx14(
                      SelectTrigger,
                      {
                        className: `w-full ${fieldState.invalid ? "border-red-500" : ""}`,
                        children: /* @__PURE__ */ jsx14(SelectValue, { placeholder: "Select a variant" })
                      }
                    ),
                    /* @__PURE__ */ jsx14(SelectContent, { children: COLORS.map((color) => /* @__PURE__ */ jsx14(SelectItem, { value: color, children: /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx14(
                        "div",
                        {
                          className: `size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`
                        }
                      ),
                      color
                    ] }) }, color)) })
                  ] }) }),
                  /* @__PURE__ */ jsx14(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx14(
              FormField,
              {
                control: form.control,
                name: "description",
                render: ({ field, fieldState }) => /* @__PURE__ */ jsxs5(FormItem, { children: [
                  /* @__PURE__ */ jsx14(FormLabel, { className: "required", children: "Description" }),
                  /* @__PURE__ */ jsx14(FormControl, { children: /* @__PURE__ */ jsx14(
                    Textarea,
                    __spreadProps(__spreadValues({}, field), {
                      placeholder: "Enter a description",
                      className: fieldState.invalid ? "border-red-500" : ""
                    })
                  ) }),
                  /* @__PURE__ */ jsx14(FormMessage, {})
                ] })
              }
            )
          ]
        }
      ) })),
      /* @__PURE__ */ jsxs5(ModalFooter, { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx14(ModalClose, { asChild: true, children: /* @__PURE__ */ jsx14(Button, { type: "button", variant: "outline", children: "Cancel" }) }),
        /* @__PURE__ */ jsx14(Button, { form: "event-form", type: "submit", children: isEditing ? "Save Changes" : "Create Event" })
      ] })
    ] })
  ] });
}

// src/lib/calendar/header/date-navigator.tsx
import { formatDate } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft as ChevronLeft2, ChevronRight as ChevronRight2 } from "lucide-react";
import { useMemo as useMemo3 } from "react";

// src/lib/components/ui/badge.tsx
import { Slot as Slot3 } from "@radix-ui/react-slot";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx15 } from "react/jsx-runtime";
var badgeVariants = cva3(
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
  const Comp = asChild ? Slot3 : "span";
  return /* @__PURE__ */ jsx15(
    Comp,
    __spreadValues({
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className)
    }, props)
  );
}

// src/lib/calendar/helpers.ts
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format as format3,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from "date-fns";
var FORMAT_STRING = "MMM d, yyyy";
function rangeText(view, date) {
  let start;
  let end;
  switch (view) {
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format3(date, FORMAT_STRING);
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    default:
      return "Error while formatting";
  }
  return `${format3(start, FORMAT_STRING)} - ${format3(end, FORMAT_STRING)}`;
}
function navigateDate(date, view, direction) {
  const operations = {
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
    year: direction === "next" ? addYears : subYears,
    agenda: direction === "next" ? addMonths : subMonths
  };
  return operations[view](date, 1);
}
function getEventsCount(events, date, view) {
  const compareFns = {
    day: isSameDay,
    week: isSameWeek,
    month: isSameMonth,
    year: isSameYear,
    agenda: isSameMonth
  };
  const compareFn = compareFns[view];
  return events.filter((event) => compareFn(parseISO(event.startDate), date)).length;
}
function groupEvents(dayEvents) {
  const sortedEvents = dayEvents.sort(
    (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );
  const groups = [];
  for (const event of sortedEvents) {
    const eventStart = parseISO(event.startDate);
    let placed = false;
    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = parseISO(lastEventInGroup.endDate);
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
  const startDate = parseISO(event.startDate);
  const dayStart = startOfDay(day);
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);
  const top = startMinutes / 1440 * 100;
  const width = 100 / groupSize;
  const left = groupIndex * width;
  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}
function getCalendarCells(selectedDate) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = endOfMonth(selectedDate).getDate();
  const firstDayOfMonth = startOfMonth(selectedDate).getDay();
  const daysInPrevMonth = endOfMonth(new Date(year, month - 1)).getDate();
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
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const eventPositions = {};
  const occupiedPositions = {};
  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });
  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(
        parseISO(a.endDate),
        parseISO(a.startDate)
      );
      const bDuration = differenceInDays(
        parseISO(b.endDate),
        parseISO(b.startDate)
      );
      return bDuration - aDuration || parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    }),
    ...singleDayEvents.sort(
      (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
    )
  ];
  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd
    });
    let position = -1;
    for (let i = 0; i < 3; i++) {
      if (eventDays.every((day) => {
        const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
        return dayPositions && !dayPositions[i];
      })) {
        position = i;
        break;
      }
    }
    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });
  return eventPositions;
}
function getMonthCellEvents(date, events, eventPositions) {
  const dayStart = startOfDay(date);
  const eventsForDate = events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return dayStart >= eventStart && dayStart <= eventEnd || isSameDay(dayStart, eventStart) || isSameDay(dayStart, eventEnd);
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
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsedDate)) return "";
  return format3(parsedDate, use24HourFormat ? "HH:mm" : "h:mm a");
}
var getFirstLetters = (str) => {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0).toUpperCase()}${words[1].charAt(0).toUpperCase()}`;
};
var getEventsForMonth = (events, date) => {
  const startOfMonthDate = startOfMonth(date);
  const endOfMonthDate = endOfMonth(date);
  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return isValid(eventStart) && isValid(eventEnd) && eventStart <= endOfMonthDate && eventEnd >= startOfMonthDate;
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
import { jsx as jsx16, jsxs as jsxs6 } from "react/jsx-runtime";
var MotionButton = motion.create(Button);
var MotionBadge = motion.create(Badge);
function DateNavigator({ view, events }) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();
  const eventCount = useMemo3(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view]
  );
  const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs6(
        motion.span,
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
      /* @__PURE__ */ jsx16(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs6(
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
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx16(
        MotionButton,
        {
          variant: "outline",
          size: "icon",
          className: "h-6 w-6",
          onClick: handlePrevious,
          variants: buttonHover,
          whileHover: "hover",
          whileTap: "tap",
          children: /* @__PURE__ */ jsx16(ChevronLeft2, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx16(
        motion.p,
        {
          className: "text-sm text-muted-foreground",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition,
          children: rangeText(view, selectedDate)
        }
      ),
      /* @__PURE__ */ jsx16(
        MotionButton,
        {
          variant: "outline",
          size: "icon",
          className: "h-6 w-6",
          onClick: handleNext,
          variants: buttonHover,
          whileHover: "hover",
          whileTap: "tap",
          children: /* @__PURE__ */ jsx16(ChevronRight2, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}

// src/lib/calendar/header/filter.tsx
import { CheckIcon as CheckIcon3, Filter, RefreshCcw } from "lucide-react";

// src/lib/components/ui/dropdown-menu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon as CheckIcon2, ChevronRightIcon, CircleIcon } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx17(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(DropdownMenuPrimitive.Group, __spreadValues({ "data-slot": "dropdown-menu-group" }, props));
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsxs7(
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
        /* @__PURE__ */ jsx17("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx17(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx17(CircleIcon, { className: "size-2 fill-current" }) }) }),
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx18 } from "react/jsx-runtime";
function Separator3(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ jsx18(
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
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx19 } from "react/jsx-runtime";
var toggleVariants = cva4(
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
  return /* @__PURE__ */ jsx19(
    TogglePrimitive.Root,
    __spreadValues({
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className }))
    }, props)
  );
}

// src/lib/calendar/header/filter.tsx
import { jsx as jsx20, jsxs as jsxs8 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs8(DropdownMenu, { children: [
    /* @__PURE__ */ jsx20(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx20(Toggle, { variant: "outline", className: "cursor-pointer w-fit", children: /* @__PURE__ */ jsx20(Filter, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxs8(DropdownMenuContent, { align: "end", className: "w-[150px]", children: [
      colors.map((color) => /* @__PURE__ */ jsxs8(
        DropdownMenuItem,
        {
          className: "flex items-center gap-2 cursor-pointer",
          onClick: (e) => {
            e.preventDefault();
            filterEventsBySelectedColors(color);
          },
          children: [
            /* @__PURE__ */ jsx20(
              "div",
              {
                className: `size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`
              }
            ),
            /* @__PURE__ */ jsxs8("span", { className: "capitalize flex justify-center items-center gap-2", children: [
              color,
              /* @__PURE__ */ jsx20("span", { children: selectedColors.includes(color) && /* @__PURE__ */ jsx20("span", { className: "text-blue-500", children: /* @__PURE__ */ jsx20(CheckIcon3, { className: "size-4" }) }) })
            ] })
          ]
        },
        color
      )),
      /* @__PURE__ */ jsx20(Separator3, { className: "my-2" }),
      /* @__PURE__ */ jsxs8(
        DropdownMenuItem,
        {
          disabled: selectedColors.length === 0,
          className: "flex gap-2 cursor-pointer",
          onClick: (e) => {
            e.preventDefault();
            clearFilter();
          },
          children: [
            /* @__PURE__ */ jsx20(RefreshCcw, { className: "size-3.5" }),
            "Clear Filter"
          ]
        }
      )
    ] })
  ] });
}

// src/lib/calendar/header/today-button.tsx
import { formatDate as formatDate2 } from "date-fns";
import { motion as motion2 } from "framer-motion";
import { jsx as jsx21, jsxs as jsxs9 } from "react/jsx-runtime";
var MotionButton2 = motion2.create(Button);
function TodayButton() {
  const { setSelectedDate } = useCalendar();
  const today = /* @__PURE__ */ new Date();
  const handleClick = () => setSelectedDate(today);
  return /* @__PURE__ */ jsxs9(
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
        /* @__PURE__ */ jsx21(
          motion2.span,
          {
            className: "w-full bg-primary py-1 text-xs font-semibold text-primary-foreground",
            initial: { y: -10, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: __spreadValues({ delay: 0.1 }, transition),
            children: formatDate2(today, "MMM").toUpperCase()
          }
        ),
        /* @__PURE__ */ jsx21(
          motion2.span,
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
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { jsx as jsx22 } from "react/jsx-runtime";
function Avatar(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx22(
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
  return /* @__PURE__ */ jsx22(
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
  return /* @__PURE__ */ jsx22(
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
import * as React3 from "react";
import { jsx as jsx23, jsxs as jsxs10 } from "react/jsx-runtime";
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
  const totalAvatars = React3.Children.count(children);
  const displayedAvatars = React3.Children.toArray(children).slice(0, max).reverse();
  const remainingAvatars = max ? Math.max(totalAvatars - max, 1) : 0;
  return /* @__PURE__ */ jsxs10(
    "div",
    __spreadProps(__spreadValues({
      className: cn("flex items-center flex-row-reverse", className)
    }, props), {
      children: [
        remainingAvatars > 0 && /* @__PURE__ */ jsx23(Avatar, { className: "-ml-2 hover:z-10 relative ring-2 ring-background", children: /* @__PURE__ */ jsxs10(AvatarFallback, { className: "bg-muted-foreground text-white", children: [
          "+",
          remainingAvatars
        ] }) }),
        displayedAvatars.map((avatar, index) => {
          if (!React3.isValidElement(avatar)) return null;
          return /* @__PURE__ */ jsx23("div", { className: "-ml-2 hover:z-10 relative", children: React3.cloneElement(avatar, {
            className: "ring-2 ring-background"
          }) }, index);
        })
      ]
    })
  );
};

// src/lib/calendar/header/user-select.tsx
import { jsx as jsx24, jsxs as jsxs11 } from "react/jsx-runtime";
function UserSelect() {
  const { users, selectedUserId, filterEventsBySelectedUser } = useCalendar();
  return /* @__PURE__ */ jsxs11(Select, { value: selectedUserId, onValueChange: filterEventsBySelectedUser, children: [
    /* @__PURE__ */ jsx24(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx24(SelectValue, { placeholder: "Select a user" }) }),
    /* @__PURE__ */ jsxs11(SelectContent, { align: "end", children: [
      /* @__PURE__ */ jsxs11(SelectItem, { value: "all", children: [
        /* @__PURE__ */ jsx24(AvatarGroup, { className: "mx-2 flex items-center", max: 3, children: users.map((user) => {
          var _a;
          return /* @__PURE__ */ jsxs11(Avatar, { className: "size-6 text-xxs", children: [
            /* @__PURE__ */ jsx24(
              AvatarImage,
              {
                src: (_a = user.picturePath) != null ? _a : void 0,
                alt: user.name
              }
            ),
            /* @__PURE__ */ jsx24(AvatarFallback, { className: "text-xxs", children: user.name[0] })
          ] }, user.id);
        }) }),
        "All"
      ] }),
      users.map((user) => {
        var _a;
        return /* @__PURE__ */ jsx24(
          SelectItem,
          {
            value: user.id,
            className: "flex-1 cursor-pointer",
            children: /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs11(Avatar, { className: "size-6", children: [
                /* @__PURE__ */ jsx24(
                  AvatarImage,
                  {
                    src: (_a = user.picturePath) != null ? _a : void 0,
                    alt: user.name
                  }
                ),
                /* @__PURE__ */ jsx24(AvatarFallback, { className: "text-xxs", children: user.name[0] })
              ] }, user.id),
              /* @__PURE__ */ jsx24("p", { className: "truncate", children: user.name })
            ] })
          },
          user.id
        );
      })
    ] })
  ] });
}

// src/lib/calendar/settings/settings.tsx
import {
  DotIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunMediumIcon
} from "lucide-react";
import { useTheme } from "next-themes";

// src/lib/components/ui/switch.tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { jsx as jsx25 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx25(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      className: cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx25(
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
import { jsx as jsx26, jsxs as jsxs12 } from "react/jsx-runtime";
function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    agendaModeGroupBy,
    setAgendaModeGroupBy
  } = useCalendar();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const isDotVariant = badgeVariant === "dot";
  return /* @__PURE__ */ jsxs12(DropdownMenu, { children: [
    /* @__PURE__ */ jsx26(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx26(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsx26(SettingsIcon, {}) }) }),
    /* @__PURE__ */ jsxs12(DropdownMenuContent, { className: "w-56", children: [
      /* @__PURE__ */ jsx26(DropdownMenuLabel, { children: "Calendar settings" }),
      /* @__PURE__ */ jsx26(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs12(DropdownMenuGroup, { children: [
        /* @__PURE__ */ jsxs12(DropdownMenuItem, { children: [
          "Use dark mode",
          /* @__PURE__ */ jsx26(DropdownMenuShortcut, { children: /* @__PURE__ */ jsx26(
            Switch,
            {
              icon: isDarkMode ? /* @__PURE__ */ jsx26(MoonIcon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx26(SunMediumIcon, { className: "h-4 w-4" }),
              checked: isDarkMode,
              onCheckedChange: (checked) => setTheme(checked ? "dark" : "light")
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs12(DropdownMenuItem, { children: [
          "Use dot badge",
          /* @__PURE__ */ jsx26(DropdownMenuShortcut, { children: /* @__PURE__ */ jsx26(
            Switch,
            {
              icon: isDotVariant ? /* @__PURE__ */ jsx26(DotIcon, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx26(PaletteIcon, { className: "w-4 h-4" }),
              checked: isDotVariant,
              onCheckedChange: (checked) => setBadgeVariant(checked ? "dot" : "colored")
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs12(DropdownMenuItem, { children: [
          "Use 24 hour format",
          /* @__PURE__ */ jsx26(DropdownMenuShortcut, { children: /* @__PURE__ */ jsx26(
            Switch,
            {
              icon: use24HourFormat ? /* @__PURE__ */ jsxs12(
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
                    /* @__PURE__ */ jsx26("title", { children: "24 Hour Format" }),
                    /* @__PURE__ */ jsx26("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                    /* @__PURE__ */ jsx26("path", { d: "M3 12a9 9 0 0 0 5.998 8.485m12.002 -8.485a9 9 0 1 0 -18 0" }),
                    /* @__PURE__ */ jsx26("path", { d: "M12 7v5" }),
                    /* @__PURE__ */ jsx26("path", { d: "M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" }),
                    /* @__PURE__ */ jsx26("path", { d: "M18 15v2a1 1 0 0 0 1 1h1" }),
                    /* @__PURE__ */ jsx26("path", { d: "M21 15v6" })
                  ]
                }
              ) : /* @__PURE__ */ jsxs12(
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
                    /* @__PURE__ */ jsx26("title", { children: "12 Hour Format" }),
                    /* @__PURE__ */ jsx26("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                    /* @__PURE__ */ jsx26("path", { d: "M3 12a9 9 0 0 0 9 9m9 -9a9 9 0 1 0 -18 0" }),
                    /* @__PURE__ */ jsx26("path", { d: "M12 7v5l.5 .5" }),
                    /* @__PURE__ */ jsx26("path", { d: "M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" }),
                    /* @__PURE__ */ jsx26("path", { d: "M15 21v-6" })
                  ]
                }
              ),
              checked: use24HourFormat,
              onCheckedChange: toggleTimeFormat
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx26(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs12(DropdownMenuGroup, { children: [
        /* @__PURE__ */ jsx26(DropdownMenuLabel, { children: "Agenda view group by" }),
        /* @__PURE__ */ jsxs12(
          DropdownMenuRadioGroup,
          {
            value: agendaModeGroupBy,
            onValueChange: (value) => setAgendaModeGroupBy(value),
            children: [
              /* @__PURE__ */ jsx26(DropdownMenuRadioItem, { value: "date", children: "Date" }),
              /* @__PURE__ */ jsx26(DropdownMenuRadioItem, { value: "color", children: "Color" })
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/lib/calendar/header/view-tabs.tsx
import { motion as motion3, AnimatePresence as AnimatePresence2 } from "motion/react";

// src/lib/components/ui/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx27 } from "react/jsx-runtime";
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx27(
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
  return /* @__PURE__ */ jsx27(
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
  return /* @__PURE__ */ jsx27(
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
import { CalendarRange, List as List2, Columns, Grid3X3, Grid2X2 } from "lucide-react";
import { memo } from "react";
import { jsx as jsx28, jsxs as jsxs13 } from "react/jsx-runtime";
var tabs = [
  {
    name: "Agenda",
    value: "agenda",
    icon: () => /* @__PURE__ */ jsx28(CalendarRange, { className: "h-4 w-4" })
  },
  {
    name: "Day",
    value: "day",
    icon: () => /* @__PURE__ */ jsx28(List2, { className: "h-4 w-4" })
  },
  {
    name: "Week",
    value: "week",
    icon: () => /* @__PURE__ */ jsx28(Columns, { className: "h-4 w-4" })
  },
  {
    name: "Month",
    value: "month",
    icon: () => /* @__PURE__ */ jsx28(Grid3X3, { className: "h-4 w-4" })
  },
  {
    name: "Year",
    value: "year",
    icon: () => /* @__PURE__ */ jsx28(Grid2X2, { className: "h-4 w-4" })
  }
];
function Views() {
  const { view, setView } = useCalendar();
  return /* @__PURE__ */ jsx28(
    Tabs,
    {
      value: view,
      onValueChange: (value) => setView(value),
      className: "gap-4 sm:w-auto w-full",
      children: /* @__PURE__ */ jsx28(TabsList, { className: "h-auto gap-2 rounded-xl p-1 w-full", children: tabs.map(({ icon: Icon2, name, value }) => {
        const isActive = view === value;
        return /* @__PURE__ */ jsx28(
          motion3.div,
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
            children: /* @__PURE__ */ jsx28(TabsTrigger, { value, asChild: true, children: /* @__PURE__ */ jsxs13(
              motion3.div,
              {
                className: "flex h-8 w-full items-center justify-center cursor-pointer",
                animate: { filter: "blur(0px)" },
                exit: { filter: "blur(2px)" },
                transition: { duration: 0.25, ease: "easeOut" },
                children: [
                  /* @__PURE__ */ jsx28(Icon2, {}),
                  /* @__PURE__ */ jsx28(AnimatePresence2, { initial: false, children: isActive && /* @__PURE__ */ jsx28(
                    motion3.span,
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
var view_tabs_default = memo(Views);

// src/lib/calendar/header/calendar-header.tsx
import { jsx as jsx29, jsxs as jsxs14 } from "react/jsx-runtime";
function CalendarHeader() {
  const { view, events } = useCalendar();
  return /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between", children: [
    /* @__PURE__ */ jsxs14(
      motion4.div,
      {
        className: "flex items-center gap-3",
        variants: slideFromLeft,
        initial: "initial",
        animate: "animate",
        transition,
        children: [
          /* @__PURE__ */ jsx29(TodayButton, {}),
          /* @__PURE__ */ jsx29(DateNavigator, { view, events })
        ]
      }
    ),
    /* @__PURE__ */ jsxs14(
      motion4.div,
      {
        className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5",
        variants: slideFromRight,
        initial: "initial",
        animate: "animate",
        transition,
        children: [
          /* @__PURE__ */ jsxs14("div", { className: "options flex-wrap flex items-center gap-4 md:gap-2", children: [
            /* @__PURE__ */ jsx29(FilterEvents, {}),
            /* @__PURE__ */ jsx29(view_tabs_default, {})
          ] }),
          /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5", children: [
            /* @__PURE__ */ jsx29(UserSelect, {}),
            /* @__PURE__ */ jsx29(AddEditEventDialog, { children: /* @__PURE__ */ jsxs14(Button, { children: [
              /* @__PURE__ */ jsx29(Plus, { className: "h-4 w-4" }),
              "Add Event"
            ] }) })
          ] }),
          /* @__PURE__ */ jsx29(Settings, {})
        ]
      }
    )
  ] });
}

// src/lib/calendar/calendar-body.tsx
import { isSameDay as isSameDay5, parseISO as parseISO12 } from "date-fns";
import { motion as motion12 } from "framer-motion";

// src/lib/calendar/views/agenda-view/agenda-events.tsx
import { format as format5, parseISO as parseISO3 } from "date-fns";

// src/lib/components/ui/command.tsx
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

// src/lib/components/ui/dialog.tsx
import * as DialogPrimitive2 from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs15 } from "react/jsx-runtime";
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx30(DialogPrimitive2.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx30(DialogPrimitive2.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx30(DialogPrimitive2.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogClose(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx30(DialogPrimitive2.Close, __spreadValues({ "data-slot": "dialog-close" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx30(
    DialogPrimitive2.Overlay,
    __spreadValues({
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )
    }, props)
  );
}
function DialogContent(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs15(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx30(DialogOverlay, {}),
    /* @__PURE__ */ jsxs15(
      DialogPrimitive2.Content,
      __spreadProps(__spreadValues({
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )
      }, props), {
        children: [
          children,
          /* @__PURE__ */ jsxs15(DialogPrimitive2.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [
            /* @__PURE__ */ jsx30(XIcon, {}),
            /* @__PURE__ */ jsx30("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      })
    )
  ] });
}
function DialogHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx30(
    "div",
    __spreadValues({
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className)
    }, props)
  );
}
function DialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx30(
    DialogPrimitive2.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/lib/components/ui/command.tsx
import { jsx as jsx31, jsxs as jsxs16 } from "react/jsx-runtime";
function Command(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx31(
    CommandPrimitive,
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
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border rounded-md px-3",
      children: [
        /* @__PURE__ */ jsx31(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx31(
          CommandPrimitive.Input,
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
  return /* @__PURE__ */ jsx31(
    CommandPrimitive.List,
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
  return /* @__PURE__ */ jsx31(
    CommandPrimitive.Empty,
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
  return /* @__PURE__ */ jsx31(
    CommandPrimitive.Group,
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
  return /* @__PURE__ */ jsx31(
    CommandPrimitive.Item,
    __spreadValues({
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}

// src/lib/calendar/dialogs/event-details-dialog.tsx
import { format as format4, parseISO as parseISO2 } from "date-fns";
import { Calendar as Calendar2, Clock, Text, User } from "lucide-react";
import { toast as toast3 } from "sonner";
import { jsx as jsx32, jsxs as jsxs17 } from "react/jsx-runtime";
function EventDetailsDialog({ event, children }) {
  const startDate = parseISO2(event.startDate);
  const endDate = parseISO2(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();
  const deleteEvent = (eventId) => {
    try {
      removeEvent(eventId);
      toast3.success("Event deleted successfully.");
    } catch (e) {
      toast3.error("Error deleting event.");
    }
  };
  return /* @__PURE__ */ jsxs17(Dialog, { children: [
    /* @__PURE__ */ jsx32(DialogTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs17(DialogContent, { children: [
      /* @__PURE__ */ jsx32(DialogHeader, { children: /* @__PURE__ */ jsx32(DialogTitle, { children: event.title }) }),
      /* @__PURE__ */ jsx32(ScrollArea, { className: "max-h-[80vh]", children: /* @__PURE__ */ jsxs17("div", { className: "space-y-4 p-4", children: [
        /* @__PURE__ */ jsxs17("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx32(User, { className: "mt-1 size-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsxs17("div", { children: [
            /* @__PURE__ */ jsx32("p", { className: "text-sm font-medium", children: "Responsible" }),
            /* @__PURE__ */ jsx32("p", { className: "text-sm text-muted-foreground", children: event.user.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx32(Calendar2, { className: "mt-1 size-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsxs17("div", { children: [
            /* @__PURE__ */ jsx32("p", { className: "text-sm font-medium", children: "Start Date" }),
            /* @__PURE__ */ jsxs17("p", { className: "text-sm text-muted-foreground", children: [
              format4(startDate, "EEEE dd MMMM"),
              /* @__PURE__ */ jsx32("span", { className: "mx-1", children: "at" }),
              formatTime(parseISO2(event.startDate), use24HourFormat)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx32(Clock, { className: "mt-1 size-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsxs17("div", { children: [
            /* @__PURE__ */ jsx32("p", { className: "text-sm font-medium", children: "End Date" }),
            /* @__PURE__ */ jsxs17("p", { className: "text-sm text-muted-foreground", children: [
              format4(endDate, "EEEE dd MMMM"),
              /* @__PURE__ */ jsx32("span", { className: "mx-1", children: "at" }),
              formatTime(parseISO2(event.endDate), use24HourFormat)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx32(Text, { className: "mt-1 size-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsxs17("div", { children: [
            /* @__PURE__ */ jsx32("p", { className: "text-sm font-medium", children: "Description" }),
            /* @__PURE__ */ jsx32("p", { className: "text-sm text-muted-foreground", children: event.description })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs17("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx32(AddEditEventDialog, { event, children: /* @__PURE__ */ jsx32(Button, { variant: "outline", children: "Edit" }) }),
        /* @__PURE__ */ jsx32(
          Button,
          {
            variant: "destructive",
            onClick: () => {
              deleteEvent(event.id);
            },
            children: "Delete"
          }
        )
      ] }),
      /* @__PURE__ */ jsx32(DialogClose, {})
    ] })
  ] });
}

// src/lib/calendar/views/month-view/event-bullet.tsx
import { cva as cva5 } from "class-variance-authority";
import { motion as motion5 } from "framer-motion";
import { jsx as jsx33 } from "react/jsx-runtime";
var eventBulletVariants = cva5("size-2 rounded-full", {
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
  return /* @__PURE__ */ jsx33(
    motion5.div,
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
import { Fragment, jsx as jsx34, jsxs as jsxs18 } from "react/jsx-runtime";
var AgendaEvents = () => {
  const {
    events,
    use24HourFormat,
    badgeVariant,
    agendaModeGroupBy,
    selectedDate
  } = useCalendar();
  const monthEvents = getEventsForMonth(events, selectedDate);
  const agendaEvents = Object.groupBy(monthEvents, (event) => {
    return agendaModeGroupBy === "date" ? format5(parseISO3(event.startDate), "yyyy-MM-dd") : event.color;
  });
  const groupedAndSortedEvents = Object.entries(agendaEvents).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  return /* @__PURE__ */ jsxs18(Command, { className: "py-4 h-[80vh] bg-transparent", children: [
    /* @__PURE__ */ jsx34("div", { className: "mb-4 mx-4", children: /* @__PURE__ */ jsx34(CommandInput, { placeholder: "Type a command or search..." }) }),
    /* @__PURE__ */ jsxs18(CommandList, { className: "max-h-max px-3 border-t", children: [
      groupedAndSortedEvents.map(([date, groupedEvents]) => /* @__PURE__ */ jsx34(
        CommandGroup,
        {
          heading: agendaModeGroupBy === "date" ? format5(parseISO3(date), "EEEE, MMMM d, yyyy") : toCapitalize(groupedEvents[0].color),
          children: groupedEvents.map((event) => /* @__PURE__ */ jsx34(
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
              children: /* @__PURE__ */ jsx34(EventDetailsDialog, { event, children: /* @__PURE__ */ jsxs18("div", { className: "w-full flex items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxs18("div", { className: "flex items-center gap-2", children: [
                  badgeVariant === "dot" ? /* @__PURE__ */ jsx34(EventBullet, { color: event.color }) : /* @__PURE__ */ jsxs18(Avatar, { children: [
                    /* @__PURE__ */ jsx34(AvatarImage, { src: "", alt: "@shadcn" }),
                    /* @__PURE__ */ jsx34(AvatarFallback, { className: getBgColor(event.color), children: getFirstLetters(event.title) })
                  ] }),
                  /* @__PURE__ */ jsxs18("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx34(
                      "p",
                      {
                        className: cn({
                          "font-medium": badgeVariant === "dot",
                          "text-foreground": badgeVariant === "dot"
                        }),
                        children: event.title
                      }
                    ),
                    /* @__PURE__ */ jsx34("p", { className: "text-muted-foreground text-sm line-clamp-1 text-ellipsis md:text-clip w-1/3", children: event.description })
                  ] })
                ] }),
                /* @__PURE__ */ jsx34("div", { className: "w-40 flex justify-center items-center gap-1", children: agendaModeGroupBy === "date" ? /* @__PURE__ */ jsxs18(Fragment, { children: [
                  /* @__PURE__ */ jsx34("p", { className: "text-sm", children: formatTime(event.startDate, use24HourFormat) }),
                  /* @__PURE__ */ jsx34("span", { className: "text-muted-foreground", children: "-" }),
                  /* @__PURE__ */ jsx34("p", { className: "text-sm", children: formatTime(event.endDate, use24HourFormat) })
                ] }) : /* @__PURE__ */ jsxs18(Fragment, { children: [
                  /* @__PURE__ */ jsx34("p", { className: "text-sm", children: format5(event.startDate, "MM/dd/yyyy") }),
                  /* @__PURE__ */ jsx34("span", { className: "text-sm", children: "at" }),
                  /* @__PURE__ */ jsx34("p", { className: "text-sm", children: formatTime(event.startDate, use24HourFormat) })
                ] }) })
              ] }) })
            },
            event.id
          ))
        },
        date
      )),
      /* @__PURE__ */ jsx34(CommandEmpty, { children: "No results found." })
    ] })
  ] });
};

// src/lib/calendar/views/month-view/calendar-month-view.tsx
import { motion as motion8 } from "framer-motion";
import { useMemo as useMemo5 } from "react";

// src/lib/calendar/views/month-view/day-cell.tsx
import { cva as cva7 } from "class-variance-authority";
import { isToday, startOfDay as startOfDay3, isSunday, isSameMonth as isSameMonth2 } from "date-fns";
import { motion as motion7 } from "framer-motion";
import { useMemo as useMemo4, useCallback as useCallback2 } from "react";

// src/lib/calendar/dialogs/events-list-dialog.tsx
import { format as format6 } from "date-fns";
import { jsx as jsx35, jsxs as jsxs19 } from "react/jsx-runtime";
function EventListDialog({
  date,
  events,
  maxVisibleEvents = 3,
  children
}) {
  var _a;
  const cellEvents = events;
  const hiddenEventsCount = Math.max(cellEvents.length - maxVisibleEvents, 0);
  const { badgeVariant, use24HourFormat } = useCalendar();
  const defaultTrigger = /* @__PURE__ */ jsxs19("span", { className: "cursor-pointer", children: [
    /* @__PURE__ */ jsxs19("span", { className: "sm:hidden", children: [
      "+",
      hiddenEventsCount
    ] }),
    /* @__PURE__ */ jsxs19("span", { className: "hidden sm:inline py-0.5 px-2 my-1 rounded-xl border", children: [
      hiddenEventsCount,
      /* @__PURE__ */ jsx35("span", { className: "mx-1", children: "more..." })
    ] })
  ] });
  return /* @__PURE__ */ jsxs19(Modal, { children: [
    /* @__PURE__ */ jsx35(ModalTrigger, { asChild: true, children: children || defaultTrigger }),
    /* @__PURE__ */ jsxs19(ModalContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsx35(ModalHeader, { children: /* @__PURE__ */ jsx35(ModalTitle, { className: "my-2", children: /* @__PURE__ */ jsxs19("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx35(EventBullet, { color: (_a = cellEvents[0]) == null ? void 0 : _a.color, className: "" }),
        /* @__PURE__ */ jsxs19("p", { className: "text-sm font-medium", children: [
          "Events on ",
          format6(date, "EEEE, MMMM d, yyyy")
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx35("div", { className: "max-h-[60vh] overflow-y-auto space-y-2", children: cellEvents.length > 0 ? cellEvents.map((event) => /* @__PURE__ */ jsx35(EventDetailsDialog, { event, children: /* @__PURE__ */ jsxs19(
        "div",
        {
          className: cn(
            "flex items-center gap-2 p-2 border rounded-md hover:bg-muted cursor-pointer",
            {
              [dayCellVariants({ color: event.color })]: badgeVariant === "colored"
            }
          ),
          children: [
            /* @__PURE__ */ jsx35(EventBullet, { color: event.color }),
            /* @__PURE__ */ jsxs19("div", { className: "flex justify-between items-center w-full", children: [
              /* @__PURE__ */ jsx35("p", { className: "text-sm font-medium", children: event.title }),
              /* @__PURE__ */ jsx35("p", { className: "text-xs", children: formatTime(event.startDate, use24HourFormat) })
            ] })
          ]
        }
      ) }, event.id)) : /* @__PURE__ */ jsx35("p", { className: "text-sm text-muted-foreground", children: "No events for this date." }) })
    ] })
  ] });
}

// src/lib/calendar/dnd/droppable-area.tsx
import { jsx as jsx36 } from "react/jsx-runtime";
function DroppableArea({
  date,
  hour,
  minute,
  children,
  className
}) {
  const { handleEventDrop, isDragging } = useDragDrop();
  return /* @__PURE__ */ jsx36(
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
import { cva as cva6 } from "class-variance-authority";
import { endOfDay, isSameDay as isSameDay2, parseISO as parseISO4, startOfDay as startOfDay2 } from "date-fns";

// src/lib/calendar/dnd/draggable-event.tsx
import { motion as motion6 } from "framer-motion";
import { jsx as jsx37 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx37(
    motion6.div,
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
import { jsx as jsx38, jsxs as jsxs20 } from "react/jsx-runtime";
var eventBadgeVariants = cva6(
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
  const { badgeVariant, use24HourFormat } = useCalendar();
  const itemStart = startOfDay2(parseISO4(event.startDate));
  const itemEnd = endOfDay(parseISO4(event.endDate));
  if (cellDate < itemStart || cellDate > itemEnd) return null;
  let position;
  if (propPosition) {
    position = propPosition;
  } else if (eventCurrentDay && eventTotalDays) {
    position = "none";
  } else if (isSameDay2(itemStart, itemEnd)) {
    position = "none";
  } else if (isSameDay2(cellDate, itemStart)) {
    position = "first";
  } else if (isSameDay2(cellDate, itemEnd)) {
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
  return /* @__PURE__ */ jsx38(DraggableEvent, { event, className: marginClass, children: /* @__PURE__ */ jsx38(EventDetailsDialog, { event, children: /* @__PURE__ */ jsxs20("button", { type: "button", className: eventBadgeClasses, children: [
    /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-1.5 truncate", children: [
      !["middle", "last"].includes(position) && badgeVariant === "dot" && /* @__PURE__ */ jsx38(EventBullet, { color: event.color }),
      renderBadgeText && /* @__PURE__ */ jsxs20("p", { className: "flex-1 truncate font-semibold", children: [
        eventCurrentDay && /* @__PURE__ */ jsxs20("span", { className: "text-xs", children: [
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
    /* @__PURE__ */ jsx38("div", { className: "hidden sm:block", children: renderBadgeTime && /* @__PURE__ */ jsx38("span", { children: formatTime(new Date(event.startDate), use24HourFormat) }) })
  ] }) }) });
}

// src/lib/calendar/views/month-view/day-cell.tsx
import { Plus as Plus2 } from "lucide-react";
import { jsx as jsx39, jsxs as jsxs21 } from "react/jsx-runtime";
var dayCellVariants = cva7("text-white", {
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
  const { cellEvents, currentCellMonth } = useMemo4(() => {
    const cellEvents2 = getMonthCellEvents(date, events, eventPositions);
    const currentCellMonth2 = startOfDay3(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
    return { cellEvents: cellEvents2, currentCellMonth: currentCellMonth2 };
  }, [date, events, eventPositions]);
  const renderEventAtPosition = useCallback2(
    (position) => {
      const event = cellEvents.find((e) => e.position === position);
      if (!event) {
        return /* @__PURE__ */ jsx39(
          motion7.div,
          {
            className: "lg:flex-1",
            initial: false,
            animate: false
          },
          `empty-${position}`
        );
      }
      const showBullet = isSameMonth2(
        new Date(event.startDate),
        currentCellMonth
      );
      return /* @__PURE__ */ jsxs21(
        motion7.div,
        {
          className: "lg:flex-1",
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          transition: __spreadValues({ delay: position * 0.1 }, transition),
          children: [
            showBullet && /* @__PURE__ */ jsx39(EventBullet, { className: "lg:hidden", color: event.color }),
            /* @__PURE__ */ jsx39(
              MonthEventBadge,
              {
                className: "hidden lg:flex",
                event,
                cellDate: startOfDay3(date)
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
  const cellContent = useMemo4(
    () => /* @__PURE__ */ jsx39(
      motion7.div,
      {
        className: cn(
          "flex h-full lg:min-h-40 flex-col gap-1 border-l border-t",
          isSunday(date) && "border-l-0"
        ),
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition,
        children: /* @__PURE__ */ jsxs21(DroppableArea, { date, className: "w-full h-full py-2", children: [
          /* @__PURE__ */ jsx39(
            motion7.span,
            {
              className: cn(
                "h-6 px-1 text-xs font-semibold lg:px-2",
                !currentMonth && "opacity-20",
                isToday(date) && "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground"
              ),
              children: day
            }
          ),
          /* @__PURE__ */ jsx39(
            motion7.div,
            {
              className: cn(
                "flex h-fit gap-1 px-2 mt-1 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
                !currentMonth && "opacity-50"
              ),
              children: cellEvents.length === 0 && !isMobile ? /* @__PURE__ */ jsx39("div", { className: "w-full h-full flex justify-center items-center group", children: /* @__PURE__ */ jsx39(AddEditEventDialog, { startDate: date, children: /* @__PURE__ */ jsxs21(
                Button,
                {
                  variant: "ghost",
                  className: "border opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  children: [
                    /* @__PURE__ */ jsx39(Plus2, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx39("span", { className: "max-sm:hidden", children: "Add Event" })
                  ]
                }
              ) }) }) : [0, 1, 2].map(renderEventAtPosition)
            }
          ),
          showMobileMore && /* @__PURE__ */ jsx39("div", { className: "flex justify-end items-end mx-2", children: /* @__PURE__ */ jsxs21("span", { className: "text-[0.6rem] font-semibold text-accent-foreground", children: [
            "+",
            showMoreCount
          ] }) }),
          showDesktopMore && /* @__PURE__ */ jsx39(
            motion7.div,
            {
              className: cn(
                "h-4.5 px-1.5 my-2 text-end text-xs font-semibold text-muted-foreground",
                !currentMonth && "opacity-50"
              ),
              initial: { opacity: 0, y: 5 },
              animate: { opacity: 1, y: 0 },
              transition: __spreadValues({ delay: 0.3 }, transition),
              children: /* @__PURE__ */ jsx39(EventListDialog, { date, events: cellEvents })
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
      isMobile
    ]
  );
  if (isMobile && currentMonth) {
    return /* @__PURE__ */ jsx39(EventListDialog, { date, events: cellEvents, children: cellContent });
  }
  return cellContent;
}

// src/lib/calendar/views/month-view/calendar-month-view.tsx
import { jsx as jsx40, jsxs as jsxs22 } from "react/jsx-runtime";
var WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function CalendarMonthView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate } = useCalendar();
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  const cells = useMemo5(() => getCalendarCells(selectedDate), [selectedDate]);
  const eventPositions = useMemo5(
    () => calculateMonthEventPositions(
      multiDayEvents,
      singleDayEvents,
      selectedDate
    ),
    [multiDayEvents, singleDayEvents, selectedDate]
  );
  return /* @__PURE__ */ jsxs22(motion8.div, { initial: "initial", animate: "animate", variants: staggerContainer, children: [
    /* @__PURE__ */ jsx40("div", { className: "grid grid-cols-7", children: WEEK_DAYS.map((day, index) => /* @__PURE__ */ jsx40(
      motion8.div,
      {
        className: "flex items-center justify-center py-2",
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: __spreadValues({ delay: index * 0.05 }, transition),
        children: /* @__PURE__ */ jsx40("span", { className: "text-xs font-medium text-t-quaternary", children: day })
      },
      day
    )) }),
    /* @__PURE__ */ jsx40("div", { className: "grid grid-cols-7 overflow-hidden", children: cells.map((cell) => /* @__PURE__ */ jsx40(
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
import { format as format8, isWithinInterval as isWithinInterval2, parseISO as parseISO9 } from "date-fns";
import { Calendar as Calendar3, Clock as Clock2, User as User2 } from "lucide-react";
import { useEffect as useEffect4, useRef as useRef2 } from "react";

// src/lib/components/ui/day-picker.tsx
import { ChevronLeft as ChevronLeft3, ChevronRight as ChevronRight3 } from "lucide-react";
import {
  DayPicker as ReactDayPicker,
  getDefaultClassNames
} from "react-day-picker";
import { jsx as jsx41 } from "react/jsx-runtime";
function DayPicker2(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays"
  ]);
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx41(
    ReactDayPicker,
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
            return /* @__PURE__ */ jsx41(ChevronLeft3, { className: "h-4 w-4" });
          }
          return /* @__PURE__ */ jsx41(ChevronRight3, { className: "h-4 w-4" });
        }
      }
    }, props)
  );
}
DayPicker2.displayName = "DayPicker";

// src/lib/calendar/views/week-and-day-view/calendar-time-line.tsx
import { useEffect as useEffect3, useState as useState4 } from "react";
import { jsx as jsx42, jsxs as jsxs23 } from "react/jsx-runtime";
function CalendarTimeline() {
  const { use24HourFormat } = useCalendar();
  const [currentTime, setCurrentTime] = useState4(/* @__PURE__ */ new Date());
  useEffect3(() => {
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
  return /* @__PURE__ */ jsxs23(
    "div",
    {
      className: "pointer-events-none absolute inset-x-0 z-50 border-t border-primary",
      style: { top: `${getCurrentTimePosition()}%` },
      children: [
        /* @__PURE__ */ jsx42("div", { className: "absolute -left-1.5 -top-1.5 size-3 rounded-full bg-primary" }),
        /* @__PURE__ */ jsx42("div", { className: "absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary", children: formatCurrentTime() })
      ]
    }
  );
}

// src/lib/calendar/views/week-and-day-view/day-view-multi-day-events-row.tsx
import {
  differenceInDays as differenceInDays2,
  endOfDay as endOfDay2,
  isWithinInterval,
  parseISO as parseISO5,
  startOfDay as startOfDay4
} from "date-fns";
import { jsx as jsx43, jsxs as jsxs24 } from "react/jsx-runtime";
function DayViewMultiDayEventsRow({
  selectedDate,
  multiDayEvents
}) {
  const dayStart = startOfDay4(selectedDate);
  const dayEnd = endOfDay2(selectedDate);
  const multiDayEventsInDay = multiDayEvents.filter((event) => {
    const eventStart = parseISO5(event.startDate);
    const eventEnd = parseISO5(event.endDate);
    return isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) || isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) || eventStart <= dayStart && eventEnd >= dayEnd;
  }).sort((a, b) => {
    const durationA = differenceInDays2(
      parseISO5(a.endDate),
      parseISO5(a.startDate)
    );
    const durationB = differenceInDays2(
      parseISO5(b.endDate),
      parseISO5(b.startDate)
    );
    return durationB - durationA;
  });
  if (multiDayEventsInDay.length === 0) return null;
  return /* @__PURE__ */ jsxs24("div", { className: "flex border-b", children: [
    /* @__PURE__ */ jsx43("div", { className: "w-18" }),
    /* @__PURE__ */ jsx43("div", { className: "flex flex-1 flex-col gap-1 border-l py-1", children: multiDayEventsInDay.map((event) => {
      const eventStart = startOfDay4(parseISO5(event.startDate));
      const eventEnd = startOfDay4(parseISO5(event.endDate));
      const currentDate = startOfDay4(selectedDate);
      const eventTotalDays = differenceInDays2(eventEnd, eventStart) + 1;
      const eventCurrentDay = differenceInDays2(currentDate, eventStart) + 1;
      return /* @__PURE__ */ jsx43(
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
import { areIntervalsOverlapping, parseISO as parseISO8 } from "date-fns";

// src/lib/calendar/views/week-and-day-view/event-block.tsx
import { cva as cva8 } from "class-variance-authority";
import { differenceInMinutes as differenceInMinutes3, parseISO as parseISO7 } from "date-fns";

// src/lib/calendar/dnd/resizable-event.tsx
import {
  addMinutes as addMinutes2,
  differenceInMinutes as differenceInMinutes2,
  format as format7,
  isAfter,
  isBefore,
  parseISO as parseISO6
} from "date-fns";
import { motion as motion9 } from "framer-motion";
import { Resizable } from "re-resizable";
import { useCallback as useCallback3, useMemo as useMemo6, useState as useState5 } from "react";
import { jsx as jsx44, jsxs as jsxs25 } from "react/jsx-runtime";
var PIXELS_PER_HOUR = 96;
var MINUTES_PER_PIXEL = 60 / PIXELS_PER_HOUR;
var MIN_DURATION = 15;
function ResizableEvent({
  event,
  children,
  className
}) {
  const { updateEvent, use24HourFormat } = useCalendar();
  const [isResizing, setIsResizing] = useState5(false);
  const [resizePreview, setResizePreview] = useState5(null);
  const start = useMemo6(() => parseISO6(event.startDate), [event.startDate]);
  const end = useMemo6(() => parseISO6(event.endDate), [event.endDate]);
  const durationInMinutes = useMemo6(
    () => differenceInMinutes2(end, start),
    [start, end]
  );
  const resizeBoundaries = useMemo6(() => {
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);
    return { dayStart, dayEnd };
  }, [start]);
  const handleResizeStart = useCallback3(() => {
    setIsResizing(true);
  }, []);
  const handleResize = useCallback3(
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
        newStart = addMinutes2(start, -delta);
      } else if (direction.includes("bottom")) {
        newEnd = addMinutes2(end, delta);
      }
      if (isBefore(newStart, resizeBoundaries.dayStart)) {
        newStart = resizeBoundaries.dayStart;
      }
      if (isAfter(newEnd, resizeBoundaries.dayEnd)) {
        newEnd = resizeBoundaries.dayEnd;
      }
      setResizePreview({
        start: format7(newStart, use24HourFormat ? "HH:mm" : "h:mm a"),
        end: format7(newEnd, use24HourFormat ? "HH:mm" : "h:mm a")
      });
      updateEvent(__spreadProps(__spreadValues({}, event), {
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
  const handleResizeStop = useCallback3(() => {
    setIsResizing(false);
    setResizePreview(null);
  }, []);
  const resizeConfig = useMemo6(
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
  return /* @__PURE__ */ jsxs25(
    motion9.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
      className: cn("relative group", className),
      children: [
        /* @__PURE__ */ jsx44(Resizable, __spreadProps(__spreadValues({}, resizeConfig), { children })),
        isResizing && resizePreview && /* @__PURE__ */ jsxs25(
          motion9.div,
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
import { jsx as jsx45, jsxs as jsxs26 } from "react/jsx-runtime";
var calendarWeekEventCardVariants = cva8(
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
  const { badgeVariant, use24HourFormat } = useCalendar();
  const start = parseISO7(event.startDate);
  const end = parseISO7(event.endDate);
  const durationInMinutes = differenceInMinutes3(end, start);
  const heightInPixels = durationInMinutes / 60 * 96 - 8;
  const color = badgeVariant === "dot" ? `${event.color}-dot` : event.color;
  const calendarWeekEventCardClasses = cn(
    calendarWeekEventCardVariants({ color, className }),
    durationInMinutes < 35 && "py-0 justify-center"
  );
  return /* @__PURE__ */ jsx45(ResizableEvent, { event, children: /* @__PURE__ */ jsx45(DraggableEvent, { event, children: /* @__PURE__ */ jsx45(EventDetailsDialog, { event, children: /* @__PURE__ */ jsxs26(
    "button",
    {
      type: "button",
      className: calendarWeekEventCardClasses,
      style: { height: `${heightInPixels}px` },
      children: [
        /* @__PURE__ */ jsxs26("div", { className: "flex items-center gap-1.5 truncate", children: [
          badgeVariant === "dot" && /* @__PURE__ */ jsx45(
            "svg",
            {
              width: "8",
              height: "8",
              viewBox: "0 0 8 8",
              xmlns: "http://www.w3.org/2000/svg",
              className: "shrink-0",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx45("circle", { cx: "4", cy: "4", r: "4" })
            }
          ),
          /* @__PURE__ */ jsx45("p", { className: "truncate font-semibold", children: event.title })
        ] }),
        durationInMinutes > 25 && /* @__PURE__ */ jsxs26("p", { children: [
          formatTime(start, use24HourFormat),
          " -",
          " ",
          formatTime(end, use24HourFormat)
        ] })
      ]
    }
  ) }) }) });
}

// src/lib/calendar/views/week-and-day-view/render-grouped-events.tsx
import { jsx as jsx46 } from "react/jsx-runtime";
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
          (otherEvent) => areIntervalsOverlapping(
            {
              start: parseISO8(event.startDate),
              end: parseISO8(event.endDate)
            },
            {
              start: parseISO8(otherEvent.startDate),
              end: parseISO8(otherEvent.endDate)
            }
          )
        )
      );
      if (!hasOverlap) style = __spreadProps(__spreadValues({}, style), { width: "100%", left: "0%" });
      return /* @__PURE__ */ jsx46("div", { className: "absolute p-1", style, children: /* @__PURE__ */ jsx46(EventBlock, { event }) }, event.id);
    })
  );
}

// src/lib/calendar/views/week-and-day-view/calendar-day-view.tsx
import { jsx as jsx47, jsxs as jsxs27 } from "react/jsx-runtime";
function CalendarDayView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate, setSelectedDate, users, use24HourFormat } = useCalendar();
  const scrollAreaRef = useRef2(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  useEffect4(() => {
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
      (event) => isWithinInterval2(now, {
        start: parseISO9(event.startDate),
        end: parseISO9(event.endDate)
      })
    ) || [];
  };
  const currentEvents = getCurrentEvents(singleDayEvents);
  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseISO9(event.startDate);
    return eventDate.getDate() === selectedDate.getDate() && eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
  });
  const groupedEvents = groupEvents(dayEvents);
  return /* @__PURE__ */ jsxs27("div", { className: "flex", children: [
    /* @__PURE__ */ jsxs27("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs27("div", { children: [
        /* @__PURE__ */ jsx47(
          DayViewMultiDayEventsRow,
          {
            selectedDate,
            multiDayEvents
          }
        ),
        /* @__PURE__ */ jsxs27("div", { className: "relative z-20 flex border-b", children: [
          /* @__PURE__ */ jsx47("div", { className: "w-18" }),
          /* @__PURE__ */ jsxs27("span", { className: "flex-1 border-l py-2 text-center text-xs font-medium text-t-quaternary", children: [
            format8(selectedDate, "EE"),
            " ",
            /* @__PURE__ */ jsx47("span", { className: "font-semibold text-t-secondary", children: format8(selectedDate, "d") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx47(ScrollArea, { className: "h-[800px]", type: "always", ref: scrollAreaRef, children: /* @__PURE__ */ jsxs27("div", { className: "flex", children: [
        /* @__PURE__ */ jsx47("div", { className: "relative w-18", children: hours.map((hour, index) => /* @__PURE__ */ jsx47("div", { className: "relative", style: { height: "96px" }, children: /* @__PURE__ */ jsx47("div", { className: "absolute -top-3 right-2 flex h-6 items-center", children: index !== 0 && /* @__PURE__ */ jsx47("span", { className: "text-xs text-t-quaternary", children: format8(
          (/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0),
          use24HourFormat ? "HH:00" : "h a"
        ) }) }) }, hour)) }),
        /* @__PURE__ */ jsxs27("div", { className: "relative flex-1 border-l", children: [
          /* @__PURE__ */ jsxs27("div", { className: "relative", children: [
            hours.map((hour, index) => /* @__PURE__ */ jsxs27(
              "div",
              {
                className: "relative",
                style: { height: "96px" },
                children: [
                  index !== 0 && /* @__PURE__ */ jsx47("div", { className: "pointer-events-none absolute inset-x-0 top-0 border-b" }),
                  /* @__PURE__ */ jsx47(
                    DroppableArea,
                    {
                      date: selectedDate,
                      hour,
                      minute: 0,
                      className: "absolute inset-x-0 top-0 h-[48px]",
                      children: /* @__PURE__ */ jsx47(
                        AddEditEventDialog,
                        {
                          startDate: selectedDate,
                          startTime: { hour, minute: 0 },
                          children: /* @__PURE__ */ jsx47("div", { className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx47("div", { className: "pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary" }),
                  /* @__PURE__ */ jsx47(
                    DroppableArea,
                    {
                      date: selectedDate,
                      hour,
                      minute: 30,
                      className: "absolute inset-x-0 bottom-0 h-[48px]",
                      children: /* @__PURE__ */ jsx47(
                        AddEditEventDialog,
                        {
                          startDate: selectedDate,
                          startTime: { hour, minute: 30 },
                          children: /* @__PURE__ */ jsx47("div", { className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" })
                        }
                      )
                    }
                  )
                ]
              },
              hour
            )),
            /* @__PURE__ */ jsx47(
              RenderGroupedEvents,
              {
                groupedEvents,
                day: selectedDate
              }
            )
          ] }),
          /* @__PURE__ */ jsx47(CalendarTimeline, {})
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs27("div", { className: "hidden w-72 divide-y border-l md:block", children: [
      /* @__PURE__ */ jsx47(
        DayPicker2,
        {
          className: "mx-auto w-fit",
          mode: "single",
          selected: selectedDate,
          onSelect: (date) => date && setSelectedDate(date),
          initialFocus: true
        }
      ),
      /* @__PURE__ */ jsxs27("div", { className: "flex-1 space-y-3", children: [
        currentEvents.length > 0 ? /* @__PURE__ */ jsxs27("div", { className: "flex items-start gap-2 px-4 pt-4", children: [
          /* @__PURE__ */ jsxs27("span", { className: "relative mt-[5px] flex size-2.5", children: [
            /* @__PURE__ */ jsx47("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" }),
            /* @__PURE__ */ jsx47("span", { className: "relative inline-flex size-2.5 rounded-full bg-green-600" })
          ] }),
          /* @__PURE__ */ jsx47("p", { className: "text-sm font-semibold text-t-secondary", children: "Happening now" })
        ] }) : /* @__PURE__ */ jsx47("p", { className: "p-4 text-center text-sm italic text-t-tertiary", children: "No appointments or consultations at the moment" }),
        currentEvents.length > 0 && /* @__PURE__ */ jsx47(ScrollArea, { className: "h-[422px] px-4", type: "always", children: /* @__PURE__ */ jsx47("div", { className: "space-y-6 pb-4", children: currentEvents.map((event) => {
          const user = users.find((user2) => user2.id === event.user.id);
          return /* @__PURE__ */ jsxs27("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx47("p", { className: "line-clamp-2 text-sm font-semibold", children: event.title }),
            user && /* @__PURE__ */ jsxs27("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx47(User2, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ jsx47("span", { className: "text-sm text-t-tertiary", children: user.name })
            ] }),
            /* @__PURE__ */ jsxs27("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx47(Calendar3, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ jsx47("span", { className: "text-sm text-t-tertiary", children: format8(new Date(event.startDate), "MMM d, yyyy") })
            ] }),
            /* @__PURE__ */ jsxs27("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx47(Clock2, { className: "size-4 text-t-quinary" }),
              /* @__PURE__ */ jsxs27("span", { className: "text-sm text-t-tertiary", children: [
                format8(
                  parseISO9(event.startDate),
                  use24HourFormat ? "HH:mm" : "hh:mm a"
                ),
                " ",
                "-",
                format8(
                  parseISO9(event.endDate),
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
import { addDays as addDays3, format as format9, isSameDay as isSameDay3, parseISO as parseISO11, startOfWeek as startOfWeek3 } from "date-fns";
import { motion as motion10 } from "framer-motion";

// src/lib/calendar/views/week-and-day-view/week-view-multi-day-events-row.tsx
import {
  addDays as addDays2,
  differenceInDays as differenceInDays3,
  endOfWeek as endOfWeek2,
  isAfter as isAfter2,
  isBefore as isBefore2,
  parseISO as parseISO10,
  startOfDay as startOfDay5,
  startOfWeek as startOfWeek2
} from "date-fns";
import { useMemo as useMemo7 } from "react";
import { jsx as jsx48, jsxs as jsxs28 } from "react/jsx-runtime";
function WeekViewMultiDayEventsRow({
  selectedDate,
  multiDayEvents
}) {
  const weekStart = startOfWeek2(selectedDate);
  const weekEnd = endOfWeek2(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays2(weekStart, i));
  const processedEvents = useMemo7(() => {
    return multiDayEvents.map((event) => {
      const start = parseISO10(event.startDate);
      const end = parseISO10(event.endDate);
      const adjustedStart = isBefore2(start, weekStart) ? weekStart : start;
      const adjustedEnd = isAfter2(end, weekEnd) ? weekEnd : end;
      const startIndex = differenceInDays3(adjustedStart, weekStart);
      const endIndex = differenceInDays3(adjustedEnd, weekStart);
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
  const eventRows = useMemo7(() => {
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
  const hasEventsInWeek = useMemo7(() => {
    return multiDayEvents.some((event) => {
      const start = parseISO10(event.startDate);
      const end = parseISO10(event.endDate);
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
  return /* @__PURE__ */ jsxs28("div", { className: "overflow-hidden flex", children: [
    /* @__PURE__ */ jsx48("div", { className: "w-18 border-b" }),
    /* @__PURE__ */ jsx48("div", { className: "grid flex-1 grid-cols-7 divide-x border-b border-l", children: weekDays.map((day, dayIndex) => /* @__PURE__ */ jsx48(
      "div",
      {
        className: "flex h-full flex-col gap-1 py-1",
        children: eventRows.map((row, rowIndex) => {
          const event = row.find(
            (e) => e.startIndex <= dayIndex && e.endIndex >= dayIndex
          );
          if (!event) {
            return /* @__PURE__ */ jsx48(
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
          return /* @__PURE__ */ jsx48(
            MonthEventBadge,
            {
              event,
              cellDate: startOfDay5(day),
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
import { jsx as jsx49, jsxs as jsxs29 } from "react/jsx-runtime";
function CalendarWeekView({ singleDayEvents, multiDayEvents }) {
  const { selectedDate, use24HourFormat } = useCalendar();
  const weekStart = startOfWeek3(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays3(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return /* @__PURE__ */ jsxs29(
    motion10.div,
    {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants: fadeIn,
      transition,
      children: [
        /* @__PURE__ */ jsxs29(
          motion10.div,
          {
            className: "flex flex-col items-center justify-center border-b p-4 text-sm sm:hidden",
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition,
            children: [
              /* @__PURE__ */ jsx49("p", { children: "Weekly view is not recommended on smaller devices." }),
              /* @__PURE__ */ jsx49("p", { children: "Please switch to a desktop device or use the daily view instead." })
            ]
          }
        ),
        /* @__PURE__ */ jsxs29(motion10.div, { className: "flex-col sm:flex", variants: staggerContainer, children: [
          /* @__PURE__ */ jsxs29("div", { children: [
            /* @__PURE__ */ jsx49(
              WeekViewMultiDayEventsRow,
              {
                selectedDate,
                multiDayEvents
              }
            ),
            /* @__PURE__ */ jsxs29(
              motion10.div,
              {
                className: "relative z-20 flex border-b",
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                transition,
                children: [
                  /* @__PURE__ */ jsx49("div", { className: "w-18" }),
                  /* @__PURE__ */ jsx49("div", { className: "grid flex-1 grid-cols-7  border-l", children: weekDays.map((day, index) => /* @__PURE__ */ jsxs29(
                    motion10.span,
                    {
                      className: "py-1 sm:py-2 text-center text-xs font-medium text-t-quaternary",
                      initial: { opacity: 0, y: -10 },
                      animate: { opacity: 1, y: 0 },
                      transition: __spreadValues({ delay: index * 0.05 }, transition),
                      children: [
                        /* @__PURE__ */ jsxs29("span", { className: "block sm:hidden", children: [
                          format9(day, "EEE").charAt(0),
                          /* @__PURE__ */ jsx49("span", { className: "block font-semibold text-t-secondary text-xs", children: format9(day, "d") })
                        ] }),
                        /* @__PURE__ */ jsxs29("span", { className: "hidden sm:inline", children: [
                          format9(day, "EE"),
                          " ",
                          /* @__PURE__ */ jsx49("span", { className: "ml-1 font-semibold text-t-secondary", children: format9(day, "d") })
                        ] })
                      ]
                    },
                    day.toISOString()
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx49(ScrollArea, { className: "h-[736px]", type: "always", children: /* @__PURE__ */ jsxs29("div", { className: "flex", children: [
            /* @__PURE__ */ jsx49(motion10.div, { className: "relative w-18", variants: staggerContainer, children: hours.map((hour, index) => /* @__PURE__ */ jsx49(
              motion10.div,
              {
                className: "relative",
                style: { height: "96px" },
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: __spreadValues({ delay: index * 0.02 }, transition),
                children: /* @__PURE__ */ jsx49("div", { className: "absolute -top-3 right-2 flex h-6 items-center", children: index !== 0 && /* @__PURE__ */ jsx49("span", { className: "text-xs text-t-quaternary", children: format9(
                  (/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0),
                  use24HourFormat ? "HH:00" : "h a"
                ) }) })
              },
              hour
            )) }),
            /* @__PURE__ */ jsxs29(
              motion10.div,
              {
                className: "relative flex-1 border-l",
                variants: staggerContainer,
                children: [
                  /* @__PURE__ */ jsx49("div", { className: "grid grid-cols-7 divide-x", children: weekDays.map((day, dayIndex) => {
                    const dayEvents = singleDayEvents.filter(
                      (event) => isSameDay3(parseISO11(event.startDate), day) || isSameDay3(parseISO11(event.endDate), day)
                    );
                    const groupedEvents = groupEvents(dayEvents);
                    return /* @__PURE__ */ jsxs29(
                      motion10.div,
                      {
                        className: "relative",
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: __spreadValues({ delay: dayIndex * 0.1 }, transition),
                        children: [
                          hours.map((hour, index) => /* @__PURE__ */ jsxs29(
                            motion10.div,
                            {
                              className: "relative",
                              style: { height: "96px" },
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              transition: __spreadValues({ delay: index * 0.01 }, transition),
                              children: [
                                index !== 0 && /* @__PURE__ */ jsx49("div", { className: "pointer-events-none absolute inset-x-0 top-0 border-b" }),
                                /* @__PURE__ */ jsx49(
                                  DroppableArea,
                                  {
                                    date: day,
                                    hour,
                                    minute: 0,
                                    className: "absolute inset-x-0 top-0  h-[48px]",
                                    children: /* @__PURE__ */ jsx49(
                                      AddEditEventDialog,
                                      {
                                        startDate: day,
                                        startTime: { hour, minute: 0 },
                                        children: /* @__PURE__ */ jsx49("div", { className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" })
                                      }
                                    )
                                  }
                                ),
                                /* @__PURE__ */ jsx49("div", { className: "pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary" }),
                                /* @__PURE__ */ jsx49(
                                  DroppableArea,
                                  {
                                    date: day,
                                    hour,
                                    minute: 30,
                                    className: "absolute inset-x-0 bottom-0 h-[48px]",
                                    children: /* @__PURE__ */ jsx49(
                                      AddEditEventDialog,
                                      {
                                        startDate: day,
                                        startTime: { hour, minute: 30 },
                                        children: /* @__PURE__ */ jsx49("div", { className: "absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" })
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            hour
                          )),
                          /* @__PURE__ */ jsx49(
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
                  /* @__PURE__ */ jsx49(CalendarTimeline, {})
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
import { getYear, isSameDay as isSameDay4, isSameMonth as isSameMonth3 } from "date-fns";
import { motion as motion11 } from "framer-motion";
import { jsx as jsx50, jsxs as jsxs30 } from "react/jsx-runtime";
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
  const { selectedDate, setSelectedDate } = useCalendar();
  const currentYear = getYear(selectedDate);
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  return /* @__PURE__ */ jsx50("div", { className: "flex flex-col h-full  overflow-y-auto p-4  sm:p-6", children: /* @__PURE__ */ jsx50(
    motion11.div,
    {
      initial: "initial",
      animate: "animate",
      variants: staggerContainer,
      className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr",
      children: MONTHS.map((month, monthIndex) => {
        const monthDate = new Date(currentYear, monthIndex, 1);
        const cells = getCalendarCells(monthDate);
        return /* @__PURE__ */ jsxs30(
          motion11.div,
          {
            className: "flex flex-col border border-border rounded-lg shadow-sm overflow-hidden",
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: __spreadValues({ delay: monthIndex * 0.05 }, transition),
            "aria-label": `${month} ${currentYear} calendar`,
            children: [
              /* @__PURE__ */ jsx50(
                "button",
                {
                  type: "button",
                  className: "w-full px-3 py-2 text-center font-semibold text-sm sm:text-base cursor-pointer hover:bg-primary/20 transition-colors bg-transparent border-none appearance-none",
                  onClick: () => setSelectedDate(new Date(currentYear, monthIndex, 1)),
                  "aria-label": `Select ${month}`,
                  children: month
                }
              ),
              /* @__PURE__ */ jsx50("div", { className: "grid grid-cols-7 text-center text-xs font-medium text-muted-foreground py-2", children: WEEKDAYS.map((day) => /* @__PURE__ */ jsx50("div", { className: "p-1", children: day }, day)) }),
              /* @__PURE__ */ jsx50("div", { className: "grid grid-cols-7 gap-0.5 p-1.5 flex-grow text-xs", children: cells.map((cell) => {
                const isCurrentMonth = isSameMonth3(cell.date, monthDate);
                const isToday2 = isSameDay4(cell.date, /* @__PURE__ */ new Date());
                const dayEvents = allEvents.filter(
                  (event) => isSameDay4(new Date(event.startDate), cell.date)
                );
                const hasEvents = dayEvents.length > 0;
                return /* @__PURE__ */ jsx50(
                  "div",
                  {
                    className: cn(
                      "flex flex-col items-center justify-start p-1 min-h-[2rem] relative",
                      !isCurrentMonth && "text-muted-foreground/40",
                      hasEvents && isCurrentMonth ? "cursor-pointer hover:bg-accent/20 hover:rounded-md" : "cursor-default"
                    ),
                    children: isCurrentMonth && hasEvents ? /* @__PURE__ */ jsx50(EventListDialog, { date: cell.date, events: dayEvents, children: /* @__PURE__ */ jsxs30("div", { className: "w-full h-full flex flex-col items-center justify-start gap-0.5", children: [
                      /* @__PURE__ */ jsx50(
                        "span",
                        {
                          className: cn(
                            "size-5 flex items-center justify-center font-medium",
                            isToday2 && "rounded-full bg-primary text-primary-foreground"
                          ),
                          children: cell.day
                        }
                      ),
                      /* @__PURE__ */ jsx50("div", { className: "flex justify-center items-center gap-0.5", children: dayEvents.length <= 2 ? dayEvents.slice(0, 2).map((event) => /* @__PURE__ */ jsx50(
                        EventBullet,
                        {
                          color: event.color,
                          className: "size-1.5"
                        },
                        event.id
                      )) : /* @__PURE__ */ jsxs30("div", { className: "flex flex-col justify-center items-center", children: [
                        /* @__PURE__ */ jsx50(
                          EventBullet,
                          {
                            color: dayEvents[0].color,
                            className: "size-1.5"
                          }
                        ),
                        /* @__PURE__ */ jsxs30("span", { className: "text-[0.6rem]", children: [
                          "+",
                          dayEvents.length - 1
                        ] })
                      ] }) })
                    ] }) }) : /* @__PURE__ */ jsx50("div", { className: "w-full h-full flex flex-col items-center justify-start", children: /* @__PURE__ */ jsx50(
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
import { jsx as jsx51, jsxs as jsxs31 } from "react/jsx-runtime";
function CalendarBody() {
  const { view, events } = useCalendar();
  const singleDayEvents = events.filter((event) => {
    const startDate = parseISO12(event.startDate);
    const endDate = parseISO12(event.endDate);
    return isSameDay5(startDate, endDate);
  });
  const multiDayEvents = events.filter((event) => {
    const startDate = parseISO12(event.startDate);
    const endDate = parseISO12(event.endDate);
    return !isSameDay5(startDate, endDate);
  });
  return /* @__PURE__ */ jsx51("div", { className: "w-full h-full overflow-scroll relative", children: /* @__PURE__ */ jsxs31(
    motion12.div,
    {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants: fadeIn,
      transition,
      children: [
        view === "month" && /* @__PURE__ */ jsx51(
          CalendarMonthView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "week" && /* @__PURE__ */ jsx51(
          CalendarWeekView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "day" && /* @__PURE__ */ jsx51(
          CalendarDayView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "year" && /* @__PURE__ */ jsx51(
          CalendarYearView,
          {
            singleDayEvents,
            multiDayEvents
          }
        ),
        view === "agenda" && /* @__PURE__ */ jsx51(
          motion12.div,
          {
            initial: "initial",
            animate: "animate",
            exit: "exit",
            variants: fadeIn,
            transition,
            children: /* @__PURE__ */ jsx51(AgendaEvents, {})
          },
          "agenda"
        )
      ]
    },
    view
  ) });
}

// src/lib/calendar/calendar.tsx
import { jsx as jsx52, jsxs as jsxs32 } from "react/jsx-runtime";
function Calendar4({ events, users }) {
  return /* @__PURE__ */ jsx52(CalendarProvider, { events, users, view: "month", children: /* @__PURE__ */ jsx52(DndProvider, { children: /* @__PURE__ */ jsxs32("div", { className: "w-full border rounded-xl", children: [
    /* @__PURE__ */ jsx52(CalendarHeader, {}),
    /* @__PURE__ */ jsx52(CalendarBody, {})
  ] }) }) });
}

// src/lib/components/ui/skeleton.tsx
import { jsx as jsx53 } from "react/jsx-runtime";
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx53(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/lib/calendar/skeletons/calendar-header-skeleton.tsx
import { jsx as jsx54, jsxs as jsxs33 } from "react/jsx-runtime";
function CalendarHeaderSkeleton() {
  return /* @__PURE__ */ jsxs33("div", { className: "flex items-center justify-between border-b px-4 py-2", children: [
    /* @__PURE__ */ jsxs33("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-8" }),
      /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-32" })
    ] }),
    /* @__PURE__ */ jsxs33("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-24" }),
      /* @__PURE__ */ jsxs33("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-8" }),
        /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-8" }),
        /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-8" })
      ] }),
      /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-24" }),
      /* @__PURE__ */ jsx54(Skeleton, { className: "h-8 w-8" })
    ] })
  ] });
}

// src/lib/calendar/skeletons/month-view-skeleton.tsx
import { jsx as jsx55, jsxs as jsxs34 } from "react/jsx-runtime";
function MonthViewSkeleton() {
  return /* @__PURE__ */ jsxs34("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsx55("div", { className: "grid grid-cols-7 border-b py-2", children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsx55("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx55(Skeleton, { className: "h-6 w-12" }) }, i)) }),
    /* @__PURE__ */ jsx55("div", { className: "grid flex-1 grid-cols-7 grid-rows-6", children: Array.from({ length: 42 }).map((_, i) => /* @__PURE__ */ jsxs34("div", { className: "border-b border-r p-1", children: [
      /* @__PURE__ */ jsx55(Skeleton, { className: "mb-1 h-6 w-6 rounded-full" }),
      /* @__PURE__ */ jsx55("div", { className: "mt-1 space-y-1", children: Array.from({ length: Math.floor(Math.random() * 3) }).map(
        (_2, j) => /* @__PURE__ */ jsx55(Skeleton, { className: "h-5 w-full" }, j)
      ) })
    ] }, i)) })
  ] });
}

// src/lib/calendar/skeletons/calendar-skeleton.tsx
import { jsx as jsx56, jsxs as jsxs35 } from "react/jsx-runtime";
function CalendarSkeleton() {
  return /* @__PURE__ */ jsx56("div", { className: "container mx-auto", children: /* @__PURE__ */ jsxs35("div", { className: "flex h-screen flex-col", children: [
    /* @__PURE__ */ jsx56(CalendarHeaderSkeleton, {}),
    /* @__PURE__ */ jsx56("div", { className: "flex-1", children: /* @__PURE__ */ jsx56(MonthViewSkeleton, {}) })
  ] }) });
}
export {
  Calendar4 as Calendar,
  CalendarSkeleton
};
//# sourceMappingURL=index.mjs.map
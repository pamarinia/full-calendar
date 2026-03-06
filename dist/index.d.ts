import * as react_jsx_runtime from 'react/jsx-runtime';

type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange";

interface IUser {
    id: string;
    name: string;
    picturePath: string | null;
}
interface IEvent {
    id: number;
    startDate: string;
    endDate: string;
    title: string;
    color: TEventColor;
    description: string;
    user: IUser;
}

interface AddEventRequest {
    startDate?: Date;
    startTime?: {
        hour: number;
        minute: number;
    };
}
interface ShowEventRequest {
    event: IEvent;
}
interface ViewDayEventsRequest {
    date: Date;
}

type CalendarProps = {
    events: IEvent[];
    users: IUser[];
    onEventUpdate?: (event: IEvent) => void;
    onRequestAddEvent?: (request: AddEventRequest) => void;
    onRequestShowEvent?: (request: ShowEventRequest) => void;
    onRequestViewDayEvents?: (request: ViewDayEventsRequest) => void;
    disableTimeFormatToggle?: boolean;
    disableUserManagement?: boolean;
};
declare function Calendar({ events, users, onEventUpdate, onRequestAddEvent, onRequestShowEvent, onRequestViewDayEvents, disableTimeFormatToggle, disableUserManagement, }: CalendarProps): react_jsx_runtime.JSX.Element;

declare function CalendarSkeleton(): react_jsx_runtime.JSX.Element;

export { type AddEventRequest, Calendar, type CalendarProps, CalendarSkeleton, type IEvent, type IUser, type ShowEventRequest, type ViewDayEventsRequest };

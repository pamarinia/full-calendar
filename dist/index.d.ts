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

type CalendarProps = {
    events: IEvent[];
    users: IUser[];
};
declare function Calendar({ events, users }: CalendarProps): react_jsx_runtime.JSX.Element;

declare function CalendarSkeleton(): react_jsx_runtime.JSX.Element;

export { Calendar, type CalendarProps, CalendarSkeleton, type IEvent, type IUser };

import { type ReactNode, cloneElement, isValidElement } from "react";
import { useCalendar } from "../contexts/calendar-context";
import { IEvent } from "../interfaces";

interface IProps {
  children: ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  event?: IEvent;
}

export function AddEditEventDialog({
  children,
  startDate,
  startTime,
  event,
}: IProps) {
  const { onRequestAddEvent, onRequestShowEvent } = useCalendar();

  const handleClick = () => {
    if (event) {
      onRequestShowEvent?.({ event });
    } else {
      onRequestAddEvent?.({ startDate, startTime });
    }
  };

  // Clone the child element to attach the onClick handler
  if (isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return <span onClick={handleClick}>{children}</span>;
}

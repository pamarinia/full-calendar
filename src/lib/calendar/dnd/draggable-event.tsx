import { motion } from "framer-motion";
import type React from "react";
import type { ReactNode } from "react";
import { useDragDrop } from "../contexts/dnd-context";
import type { IEvent } from "../interfaces";

interface DraggableEventProps {
  event: IEvent;
  children: ReactNode;
  className?: string;
}

export function DraggableEvent({
  event,
  children,
  className,
}: DraggableEventProps) {
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();

  const isCurrentlyDragged = isDragging && draggedEvent?.id === event.id;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      className={`w-full ${className || ""} ${
        isCurrentlyDragged ? "opacity-50 cursor-grabbing" : "cursor-grab"
      }`}
      draggable
      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e)}
      onDragStart={(e) => {
        const dragEvent = e as unknown as DragEvent;
        dragEvent.dataTransfer!.setData("text/plain", event.id.toString());
        dragEvent.dataTransfer!.effectAllowed = "move";
        startDrag(event);
      }}
      onDragEnd={() => {
        endDrag();
      }}
    >
      {children}
    </motion.div>
  );
}

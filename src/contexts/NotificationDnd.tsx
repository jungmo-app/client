'use client';

import { ReactNode } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useDraggable, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';

interface NotificationDndProviderProps {
  children: ReactNode;
}

interface SwipeableNotificationProps {
  id: number[];
  children: ReactNode;
}

export const NotificationDndProvider = ({ children }: NotificationDndProviderProps) => {
  const { mutate: deleteNotification } = useDeleteNotification();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, delta } = e;
    if (Math.abs(delta.x) > 200) {
      const id = JSON.parse(active.id as string) as number[];
      deleteNotification(id);
    }
  };
  return (
    <DndContext sensors={sensors} autoScroll={false} modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};

export const SwipeableNotification = ({ id, children }: SwipeableNotificationProps) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: JSON.stringify(id),
  });

  const style = {
    transform: CSS.Transform.toString({
      x: transform?.x ?? 0,
      y: 0,
      scaleX: transform?.scaleX ?? 1,
      scaleY: transform?.scaleY ?? 1,
    }),
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    opacity: transform?.x ? 1 - Math.abs(transform.x) / 200 : 1,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="w-full" style={style}>
      {children}
    </div>
  );
};

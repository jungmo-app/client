'use client';

import { ReactNode } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';

interface NotificationDndProviderProps {
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

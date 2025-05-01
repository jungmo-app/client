'use client';

import { clsx } from 'clsx';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SwipeableNotification } from '@/contexts/NotificationDnd';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';
import { useReadNotification } from '@/hooks/useMutate/useReadNotification';
import { NotificationType } from '@/types/notification';
import { getTimeline, parseKST } from '@/utils/date';

interface NotificationProps {
  notification: NotificationType;
}

export default function Notification({ notification }: NotificationProps) {
  const router = useRouter();

  const { notificationId, gatheringId, read: isRead } = notification;
  const { mutate: deleteNotification, isPending } = useDeleteNotification();
  const { mutate: readNotification } = useReadNotification({
    onMutate: () => {
      router.push(`/appointment/${gatheringId}`);
    },
  });

  const handleClickNotification = async () => {
    if (!isRead) {
      readNotification(notificationId);
      return;
    }
    router.push(`/appointment/${gatheringId}`);
  };

  const handleClickDeleteButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification([notificationId]);
  };

  return (
    <SwipeableNotification id={[notificationId]}>
      <div className="group relative w-full cursor-pointer" onClick={handleClickNotification}>
        <button
          className="invisible absolute right-2 top-2 z-10 flex select-none items-center justify-center rounded-full p-[2px] hover:bg-gray-100 group-hover:visible dark:hover:bg-gray-700"
          disabled={isPending}
          onClick={handleClickDeleteButton}
        >
          <X className="size-[14px]" />
        </button>

        <div
          className={clsx(
            'dark:border-gray-600, relative flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-background p-3 text-left shadow-sm hover:shadow-md',
            isRead && 'opacity-50'
          )}
        >
          <div className="relative flex size-7 items-center justify-center gap-2">
            <Image
              fill
              src={notification.profileImage ?? '/sample.jpg'}
              sizes="28px"
              alt="image"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between overflow-hidden">
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full max-w-36 flex-shrink items-center gap-2">
                <div className="truncate text-xs font-semibold">{notification.title}</div>
                <div className="flex-shrink-0 self-end text-[10px] text-gray-400">
                  {getTimeline(parseKST(new Date(notification.createdAt)))}
                </div>
              </div>
            </div>

            <div className="mt-0.5 line-clamp-2 max-h-8 w-full break-words text-xs text-gray-700 dark:text-gray-400">
              {notification.message}
            </div>
          </div>
        </div>
      </div>
    </SwipeableNotification>
  );
}

'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';
import { useReadNotification } from '@/hooks/useMutate/useReadNotification';
import { NotificationType } from '@/types/notification';
import { getTimeline, parseKST } from '@/utils/date';

interface NotificationProps {
  notification: NotificationType;
  isEdit: boolean;
}

export default function Notification({ notification, isEdit }: NotificationProps) {
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
    <div className="relative w-full cursor-pointer" onClick={handleClickNotification}>
      {isEdit && (
        <button
          className="absolute right-2 top-2 z-10 flex select-none items-center justify-center rounded-full p-[2px] hover:bg-gray-100"
          disabled={isPending}
          onClick={handleClickDeleteButton}
        >
          <X className="size-[14px]" />
        </button>
      )}
      <div
        className={`relative flex w-full gap-3 rounded-lg border border-gray-300 bg-background p-3 text-left shadow-sm dark:border-gray-600 ${
          isRead && 'opacity-50'
        } hover:shadow-md`}
      >
        <div className="flex flex-shrink-0 items-center gap-2">
          <Image
            src={notification.profileImage ?? '/sample.jpg'}
            width={28}
            height={28}
            alt="image"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <div className="truncate text-sm font-semibold">{notification.title}</div>
          <div className="mt-0.5 line-clamp-2 max-h-8 w-full break-words text-xs text-gray-700 dark:text-gray-400">
            {notification.message}
          </div>
          <div className="mt-1 self-end text-[10px] text-gray-400">
            {getTimeline(parseKST(new Date(notification.createdAt)))}
          </div>
        </div>
      </div>
    </div>
  );
}

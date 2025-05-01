import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SwipeableNotification } from '@/contexts/NotificationDnd';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';
import { useReadNotification } from '@/hooks/useMutate/useReadNotification';
import { NotificationType } from '@/types/notification';
import { getTimeline, parseKST } from '@/utils/date';
import Notification from './notification';

interface GroupNotificationProps {
  notification: NotificationType[];
}

export default function GroupNotification({ notification }: GroupNotificationProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: readNotification } = useReadNotification({
    onMutate: () => {
      router.push(`/appointment/${notification[0].gatheringId}`);
    },
  });

  const notificationId = notification.map(item => item.notificationId);

  const handleClickDeleteButton = () => {
    deleteNotification(notificationId);
  };

  const handleClickNotification = () => {
    const unreadId = notification.filter(noti => !noti.read).map(noti => noti.notificationId);
    readNotification(unreadId);
  };

  const isRead = notification.every(item => item.read === true);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {isOpen ? (
        <div className="mb-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="mb-1 mt-2 flex items-center justify-between px-2">
            <p className="truncate text-xs font-semibold">{notification[0].title}</p>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                className="flex select-none items-center justify-center rounded-full p-[2px] hover:bg-gray-100"
                onClick={handleButtonClick}
              >
                <ChevronUp className="size-4" />
              </button>

              <button
                className="flex select-none items-center justify-center rounded-full p-[2px] hover:bg-gray-100"
                onClick={handleClickDeleteButton}
              >
                <X className="size-[14px]" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {notification.map(noti => (
              <Notification key={`notification-${noti.notificationId}`} notification={noti} />
            ))}
          </div>
        </div>
      ) : (
        <SwipeableNotification id={notificationId}>
          <div
            className={`relative flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-background p-3 text-left shadow-sm dark:border-gray-600 ${
              isRead && 'opacity-50'
            } hover:shadow-md`}
            onClick={handleClickNotification}
          >
            <div className="absolute right-2 top-3 z-50 flex flex-shrink-0 items-center">
              <p className="relative -top-1/2 text-[10px] text-gray-400">
                {notification.length > 99 ? '99+' : notification.length}
              </p>
              <button onClick={handleButtonClick}>
                <ChevronDown className="size-4 stroke-gray-400" />
              </button>
            </div>
            <div className="relative flex size-7 items-center justify-center gap-2">
              <Image
                fill
                src={notification[0].profileImage ?? '/sample.jpg'}
                sizes="28px"
                alt="image"
                className="rounded-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-hidden">
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full max-w-36 flex-shrink items-center gap-2">
                  <div className="truncate text-xs font-semibold">{notification[0].title}</div>
                  <div className="flex-shrink-0 self-end text-[10px] text-gray-400">
                    {getTimeline(parseKST(new Date(notification[0].createdAt)))}
                  </div>
                </div>
              </div>

              <div className="mt-0.5 line-clamp-2 max-h-8 w-full break-words text-xs text-gray-700 dark:text-gray-400">
                {notification[0].message}
              </div>
              <div className="mt-0.5 line-clamp-2 max-h-8 w-full break-words text-xs text-gray-700 dark:text-gray-400">
                {notification[1].message}
              </div>
            </div>
          </div>
        </SwipeableNotification>
      )}
    </>
  );
}

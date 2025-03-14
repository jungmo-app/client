'use client';

import { useContext } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { NotificationContext } from '@/contexts/NotificationProvider';
import { NotificationType } from '@/types/notification';

interface NotificationProps {
  notification: NotificationType;
  isEdit: boolean;
}

export default function Notification({ notification, isEdit }: NotificationProps) {
  const { notificationId /* gatheringId */ } = notification;
  /* const router = useRouter(); */
  const { changeNotification } = useContext(NotificationContext);
  const handleClickNotification = async () => {
    console.log('click');
    /* api function */
    changeNotification(prev =>
      prev.map(item => (item.notificationId === notificationId ? { ...item, read: true } : item))
    );
    /* router.push(`/appointment/${gatheringId}`); */
  };

  const handleClickDeleteButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('delete');
    changeNotification(prev => prev.filter(item => item.notificationId !== notificationId));
  };

  return (
    <button className="relative w-full" onClick={handleClickNotification}>
      {isEdit && (
        <button
          className="absolute -right-2 -top-2 z-10 flex items-center justify-center rounded-full bg-gray-200 p-[2px]"
          onClick={handleClickDeleteButton}
        >
          <X className="size-[14px]" />
        </button>
      )}
      <div
        className={`relative flex w-full gap-3 rounded-lg border border-gray-300 bg-white p-3 text-left shadow-sm ${notification.read && 'opacity-50'} hover:shadow-md`}
      >
        <div className="flex flex-shrink-0 items-center gap-2">
          <Image
            src="https://picsum.photos/id/517/200/200/"
            width={28}
            height={28}
            alt="image"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-center justify-between gap-2">
            <div className="text-bold flex-shrink truncate">
              제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목
            </div>
            <div className="flex-shrink-0 text-xs text-gray-500">{notification.createdAt}</div>
          </div>
          <div>
            <div className="line-clamp-2 text-xs">{notification.message}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

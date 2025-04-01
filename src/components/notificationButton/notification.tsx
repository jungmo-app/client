'use client';

import { useContext } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button } from '@/components/ui';
import { SessionContext } from '@/contexts/SessionProvider';
import { NotificationType } from '@/types/notification';

interface NotificationProps {
  notification: NotificationType;
  isEdit: boolean;
}

export default function Notification({ notification, isEdit }: NotificationProps) {
  const router = useRouter();
  const { notificationId, gatheringId } = notification;

  const { changeNotification } = useContext(SessionContext);

  const handleClickNotification = async () => {
    const response = await apis.notification.readNotification([notificationId]);
    if (response?.status === 200) {
      changeNotification(prev =>
        prev.map(item => (item.notificationId === notificationId ? { ...item, read: true } : item))
      );
      router.push(`/appointment/${gatheringId}`);
    }
  };

  const handleClickDeleteButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await apis.notification.deleteNotification([notificationId]);
    if (response?.status === 200) {
      changeNotification(prev => prev.filter(item => item.notificationId !== notificationId));
      return;
    }
    if (response) {
      alert('삭제에 실패하였습니다.');
    }
  };

  return (
    <div className="relative w-full" onClick={handleClickNotification}>
      {isEdit && (
        <Button
          className="absolute -right-2 -top-2 z-10 flex items-center justify-center rounded-full bg-gray-200 p-[2px]"
          aria-label="닫기"
          variant="ghost"
          size="icon"
          onClick={handleClickDeleteButton}
        >
          <X className="size-[14px]" />
        </Button>
      )}
      <div
        className={`relative flex w-full gap-3 rounded-lg border border-gray-300 bg-background p-3 text-left shadow-sm ${notification.read && 'opacity-50'} hover:shadow-md`}
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
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-center justify-between gap-2">
            <div className="text-bold flex-shrink truncate">{notification.title}</div>
            <div className="flex-shrink-0 text-xs text-gray-500">{notification.createdAt}</div>
          </div>
          <div>
            <div className="line-clamp-2 text-xs">{notification.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

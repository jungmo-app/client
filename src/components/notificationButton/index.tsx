'use client';

import { Bell } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { NotificationDndProvider } from '@/contexts/NotificationDnd';
import { useDeleteNotification } from '@/hooks/useMutate/useDeleteNotification';
import { useNotification } from '@/hooks/useQuery/useNotification';
import { NotificationType } from '@/types/notification';
import GroupNotification from './groupNotification';
import Notification from './notification';

export default function NotificationButton() {
  const { data: notification } = useNotification();
  const { mutate: deleteNotification } = useDeleteNotification();

  const groupNotification = Object.values(
    (notification ?? []).reduce(
      (acc, noti) => {
        (acc[noti.gatheringId] ??= []).push(noti);
        return acc;
      },
      {} as Record<number, NotificationType[]>
    )
  ).sort((a, b) => new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime());

  const unReadCount = notification?.filter(item => !item.read).length ?? 0;

  const handleClickDeleteAllButton = async () => {
    const notificationIdList = (notification ?? [])?.map(item => item.notificationId);
    deleteNotification(notificationIdList);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" aria-label="알림">
            <Bell className="size-5" />
            {unReadCount > 0 && (
              <div
                className={`absolute right-[7px] top-[6px] flex size-[14px] cursor-pointer items-center justify-center rounded-full bg-red-600 ${unReadCount > 99 ? 'text-[8px]' : 'text-[10px]'} text-white`}
              >
                {unReadCount > 99 ? '99+' : unReadCount}
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent style={{ width: '300px', padding: '8px' }} align="end" className="dark:border-gray-500">
        <NotificationDndProvider>
          {notification && (
            <>
              <div className="my-2 flex items-center justify-between px-4">
                <span className="text-sm font-medium">{`알림 ${notification.length}개`}</span>
              </div>
              {(groupNotification?.length ?? 0 > 0) ? (
                <div className="mb-6 mt-2 flex max-h-80 w-full flex-col items-center gap-2 overflow-y-auto overflow-x-clip p-2 pb-2 text-sm">
                  {groupNotification?.map(item =>
                    item.length > 1 ? (
                      <GroupNotification key={`appointment-${item[0].gatheringId}`} notification={item} />
                    ) : (
                      <Notification key={`notification-${item[0].notificationId}`} notification={item[0]} />
                    )
                  )}
                </div>
              ) : (
                <div className="flex h-56 flex-1 items-center justify-center text-sm text-gray-500">
                  알림이 없습니다
                </div>
              )}

              <button
                className="absolute bottom-2 right-5 select-none text-xs text-gray-400 hover:text-gray-500"
                onClick={handleClickDeleteAllButton}
              >
                전체 지우기
              </button>
            </>
          )}
        </NotificationDndProvider>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useNotification } from '@/hooks/useQuery/useNotification';
import Notification from './notification';

export default function NotificationButton() {
  /* const router = useRouter(); */
  const queryClient = useQueryClient();
  const { data: notification } = useNotification();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const unReadCount = notification?.filter(item => !item.read).length ?? 0;

  const handleClickEditButton = () => {
    setIsEdit(prev => !prev);
  };

  const handleClickDeleteAllButton = async () => {
    /* api */
    queryClient.setQueryData(['notification'], []);
    setIsEdit(false);
  };

  return (
    <Popover onOpenChange={() => setIsEdit(false)}>
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
        {notification && (
          <>
            <div className="my-2 flex items-center justify-between px-4">
              <span className="text-sm font-medium">{`알림 ${notification.length}개`}</span>
              {notification.length > 0 && (
                <button
                  className="select-none text-xs text-gray-500 outline-none transition hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  onClick={handleClickEditButton}
                >
                  {isEdit ? '끝내기' : '편집하기'}
                </button>
              )}
            </div>
            {(notification?.length ?? 0 > 0) ? (
              <div className="mb-6 mt-2 flex max-h-80 w-full flex-col items-center gap-2 overflow-auto p-2 pb-2 text-sm">
                {notification?.map(item => (
                  <Notification key={item.notificationId} notification={item} isEdit={isEdit} />
                ))}
              </div>
            ) : (
              <div className="flex h-56 flex-1 items-center justify-center text-sm text-gray-500">알림이 없습니다</div>
            )}

            {isEdit && (
              <button
                className="absolute bottom-2 right-5 select-none text-xs text-gray-400"
                onClick={handleClickDeleteAllButton}
              >
                전체 지우기
              </button>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

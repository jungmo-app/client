'use client';

import { useContext, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { SessionContext } from '@/contexts/SessionProvider';
import Notification from './notification';

export default function NotificationButton() {
  /* const router = useRouter(); */
  const { notification, changeNotification } = useContext(SessionContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const unReadCount = notification.filter(item => !item.read).length;

  const handleClickEditButton = () => {
    setIsEdit(prev => !prev);
  };

  const handleClickDeleteAllButton = async () => {
    /* api */
    changeNotification([]);
    setIsEdit(false);
  };

  return (
    <Popover onOpenChange={() => setIsEdit(false)}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" aria-label="알림">
            <Bell className="size-5" />
          </Button>
          {unReadCount > 0 && (
            <div
              className={`absolute right-[7px] top-[6px] flex size-[14px] items-center justify-center rounded-full bg-red-600 ${unReadCount > 99 ? 'text-[8px]' : 'text-[10px]'} text-white`}
            >
              {unReadCount > 99 ? '99+' : unReadCount}
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent style={{ width: '300px', padding: '8px' }} align="end">
        <div className="item-center my-2 ml-2 flex justify-between">
          <span>{`알림 ${notification.length}개`}</span>
          {notification.length > 0 && (
            <button className="mr-4 text-xs text-gray-400" onClick={handleClickEditButton}>
              {isEdit ? '끝내기' : '편집하기'}
            </button>
          )}
        </div>
        {notification.length > 0 ? (
          <div className="mb-6 mt-2 flex max-h-80 w-full flex-col items-center gap-2 overflow-auto p-2 pb-2 text-sm">
            {notification.map(item => (
              <Notification key={item.notificationId} notification={item} isEdit={isEdit} />
            ))}
          </div>
        ) : (
          <div className="flex h-56 flex-1 items-center justify-center text-sm text-gray-500">알림이 없습니다</div>
        )}

        {isEdit && (
          <button className="absolute bottom-2 right-5 text-xs text-gray-400" onClick={handleClickDeleteAllButton}>
            전체 지우기
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

import Image from 'next/image';
import { ChatType } from '@/types/chat';
import { formatTime, formattedDateKr } from '@/utils/date';
import { cn } from '@/utils/styles';

interface ChatBubbleProps {
  isMe: boolean;
  time?: boolean;
  date?: boolean;
  unReadCount?: number;
  chatData: ChatType;
}

export default function ChatBubble({ isMe, chatData, time = false, date = false, unReadCount }: ChatBubbleProps) {
  return (
    <div className="max-w-[476px] pr-2" style={{ width: 'calc(100vw - 24px)' }}>
      {date && (
        <div className="my-4 flex w-full justify-center">
          <div className="rounded-3xl bg-shadow-15 px-4 py-2 text-[10px] text-background dark:bg-white-shadow-15 dark:text-foreground">
            {formattedDateKr(new Date(chatData.date))}
          </div>
        </div>
      )}

      <div className={`flex w-full gap-1 ${isMe ? 'flex-row-reverse' : ''}`}>
        {!isMe && (
          <div className="size-8 flex-shrink-0">
            <Image src="/sample.jpg" alt="profile" width="32" height="32" className="rounded-full" />
          </div>
        )}

        <div className={cn('flex min-w-0 flex-1 flex-col gap-1', isMe && 'items-end')}>
          {!isMe && <div className="w-20 truncate text-left text-xs">이름</div>}

          <div className={cn('flex w-full min-w-0 items-end gap-1', isMe && 'flex-row-reverse')}>
            <div
              className={cn(
                'min-w-0 max-w-[85%] text-ellipsis whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm',
                isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
              )}
            >
              {chatData.text}
            </div>

            <div className={`flex min-w-10 flex-shrink-0 flex-col text-[9px] ${isMe && 'items-end'}`}>
              {unReadCount ? <p>{unReadCount}</p> : null}
              {time ? <p className="text-gray-500">{formatTime(new Date(chatData.date))}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

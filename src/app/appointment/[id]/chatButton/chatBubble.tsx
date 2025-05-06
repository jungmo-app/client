import Image from 'next/image';
import { ChatType } from '@/types/chat';
import { formatTime, formattedDateKr } from '@/utils/date';

interface ChatBubbleProps {
  isMe: boolean;
  time?: boolean;
  date?: boolean;
  unReadCount?: number;
  chatData: ChatType;
}

export default function ChatBubble({ isMe, chatData, time = false, date = false, unReadCount }: ChatBubbleProps) {
  return (
    <div>
      {date && (
        <div className="flex w-full justify-center">
          <div className="dark:bg- my-4 rounded-3xl bg-shadow-15 px-4 py-2 text-[10px] text-background dark:bg-white-shadow-15 dark:text-foreground">
            {formattedDateKr(new Date(chatData.date))}
          </div>
        </div>
      )}

      <div className={`flex gap-1 ${isMe && 'flex-row-reverse'}`}>
        {!isMe && (
          <div className="size-8">
            <Image src="/sample.jpg" alt="profile" width="32" height="32" className="rounded-full" />
          </div>
        )}

        <div className={`flex w-80 flex-col gap-1 ${isMe && 'items-end'}`}>
          {!isMe && <div className={`w-20 truncate text-xs ${isMe && 'text-right'}`}>이름</div>}
          <div className={`flex items-end ${isMe && 'flex-row-reverse'} gap-[6px]`}>
            <div
              className={`relative w-fit max-w-72 ${isMe ? `bg-blue-500 text-white` : `bg-gray-100 text-gray-900`} whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm leading-relaxed`}
            >
              {chatData.text}
            </div>
            <div className={`flex flex-col ${isMe && 'items-end'}`}>
              {unReadCount && <p className="text-[9px]">{unReadCount}</p>}
              {time && <p className="text-[9px] text-gray-500">{formatTime(new Date(chatData.date))}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

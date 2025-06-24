import { useCallback, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui';
import { useInfiniteScrollUp } from '@/hooks/useInfiniteScrollUp';
import { ChatType } from '@/types/chat';
import { isSameDateHourMinute, isSameDay } from '@/utils/date';
import ChatBubble from './chatBubble';
import ScrollLoadingIcon from './scrollLoadingIcon';

export default function ChatList() {
  const id = useRef<number>(11);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [chat, setChat] = useState<ChatType[]>([
    {
      id: 1,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
      unReadCount: 2,
    },
    {
      id: 2,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
      unReadCount: 2,
    },
    {
      id: 3,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
      unReadCount: 2,
    },
    {
      id: 4,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: `test1test1test1test1/ntest1test1`,
      date: 'Fri May 02 2025 18:52:11 GMT+0900 (한국 표준시)',
      unReadCount: 3,
    },
    {
      id: 5,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sat May 03 2025 18:52:11 GMT+0900 (한국 표준시)',
      unReadCount: 4,
    },
    {
      id: 6,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sat May 03 2025 18:53:11 GMT+0900 (한국 표준시)',
      unReadCount: 4,
    },
    {
      id: 7,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Sun May 04 2025 18:51:11 GMT+0900 (한국 표준시)',
      unReadCount: 2,
    },
    {
      id: 8,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: `test1test1test1test1/ntest1test1`,
      date: 'Sun May 04 2025 18:52:11 GMT+0900 (한국 표준시)',
      unReadCount: 3,
    },
    {
      id: 9,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sun May 04 2025 18:52:11 GMT+0900 (한국 표준시)',
      unReadCount: 4,
    },
    {
      id: 10,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sun May 04 2025 18:53:11 GMT+0900 (한국 표준시)',
      unReadCount: 4,
    },
  ]);

  const handleTopIntersect = useCallback(async () => {
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    setIsPending(true);

    await wait(3000);
    setChat(prev => {
      const newChat = Array.from({ length: 20 }, (_, index) => ({
        id: id.current + index,
        userId: Math.random() < 0.5 ? 2 : 3,
        profileImage: null,
        userName: 'test3',
        text: `test1test1`,
        date: 'Sun May 04 2025 18:53:11 GMT+0900 (한국 표준시)',
        unReadCount: 4,
      })) as ChatType[];

      id.current += 20;
      setIsPending(false);

      return [...newChat, ...prev];
    });
  }, []);

  const { containerRef, targetRef: obserberRef } = useInfiniteScrollUp<HTMLDivElement, HTMLDivElement>({
    onIntersect: handleTopIntersect,
    heightDelta: 32,
  });

  return (
    <ScrollArea ref={containerRef} className="relative mt-2 flex flex-shrink flex-grow flex-col px-2" position="bottom">
      <div ref={obserberRef} />
      {isPending && <ScrollLoadingIcon />}
      <div className="flex w-full flex-1 flex-col gap-4 px-2 pb-2">
        {chat.map((item, i) => {
          return (
            <ChatBubble
              key={item.id}
              isMe={item.userId === 2}
              chatData={item}
              date={i === 0 || !isSameDay(new Date(chat[i - 1].date), new Date(item.date))}
              unReadCount={item.unReadCount}
              time={
                i === chat.length - 1 ||
                chat[i + 1].userId !== item.userId ||
                !isSameDateHourMinute(new Date(chat[i + 1].date), new Date(item.date))
              }
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

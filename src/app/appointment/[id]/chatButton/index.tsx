'use client';

import { useQueryClient } from '@tanstack/react-query';
import { MessageSquare, SendHorizonal } from 'lucide-react';
import { Button, ScrollArea, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { ChatType } from '@/types/chat';
import { UserInfoResponse } from '@/types/user';
import ChatBubble from './chatBubble';

export default function ChatButton() {
  const querClient = useQueryClient();
  const data = querClient.getQueryData<UserInfoResponse>(['userData']);
  console.log(data);
  console.log(new Date());
  const chat: ChatType[] = [
    {
      id: 1,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 2,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 3,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:51:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 4,
      userId: 2,
      profileImage: null,
      userName: 'test2',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:52:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 5,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:52:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 6,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: 'test1test1test1test1/ntest1test1',
      date: 'Fri May 02 2025 18:53:11 GMT+0900 (한국 표준시)',
    },
  ];

  console.log(chat);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="채팅 버튼">
          <MessageSquare className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col" style={{ padding: '0px', height: '100vh', overflow: 'hidden' }}>
        <SheetHeader className="border-b border-gray-200 p-3 px-4 dark:border-gray-600">
          <SheetTitle>채팅</SheetTitle>
        </SheetHeader>
        <ScrollArea className="relative mt-2 flex flex-grow flex-col px-2">
          <div className="flex flex-col gap-2 pb-2">
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <div className="flex w-full justify-center">
              <div className="dark:bg- my-4 rounded-3xl bg-shadow-15 px-4 py-2 text-[10px] text-background dark:bg-white-shadow-15 dark:text-foreground">
                2025년 5월 1일
              </div>
            </div>
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
            <ChatBubble
              isMe
              message={[`test1test1test1test1test1test1test1test1test1test1test1test1\ntest2`, 'test2']}
            />
            <ChatBubble isMe={false} message={['test2']} />
          </div>
        </ScrollArea>
        <form className="mb-2 flex w-full max-w-mobile items-end gap-2 rounded-md p-2">
          <textarea
            className="flex h-40 w-full resize-none items-center rounded-md border border-gray-400 py-[9px] text-sm outline-none"
            placeholder="메세지를 입력해주세요"
          />
          <Button variant="secondary" size="icon" style={{ borderRadius: '9999px' }}>
            <SendHorizonal />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

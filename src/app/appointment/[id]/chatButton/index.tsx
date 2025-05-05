'use client';

import { useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { Button, ScrollArea, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { UserInfoResponse } from '@/types/user';
import ChatInput from './chatInput';
import ChatList from './chatList';

export default function ChatButton() {
  const querClient = useQueryClient();
  const data = querClient.getQueryData<UserInfoResponse>(['userData']);
  console.log(data);

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
        <ScrollArea className="relative mt-2 flex flex-shrink flex-grow flex-col px-2">
          <ChatList />
        </ScrollArea>
        <ChatInput />
      </SheetContent>
    </Sheet>
  );
}

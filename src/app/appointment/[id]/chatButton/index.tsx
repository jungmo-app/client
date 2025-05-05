'use client';

import { useQueryClient } from '@tanstack/react-query';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { ChevronLeft, Menu, MessageSquare } from 'lucide-react';
import {
  Button,
  ScrollArea,
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { UserInfoResponse } from '@/types/user';
import { cn } from '@/utils/styles';
import ChatInput from './chatInput';
import ChatList from './chatList';

const sheetVariants = cva(
  'absolute w-full z-[9999] bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-full max-w-[500px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right:
          'inset-y-0 right-0 h-full w-full max-w-[500px] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

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
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          className={cn(sheetVariants({ side: 'right' }), 'flex h-full flex-col')}
          aria-describedby={undefined}
          style={{ padding: '0px', height: '100vh', overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <SheetClose>
                <ChevronLeft className="size-5" />
              </SheetClose>
              <SheetTitle style={{ fontSize: '17px' }}>채팅</SheetTitle>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[50%]">
                <div>test</div>
              </SheetContent>
            </Sheet>
          </div>

          <ScrollArea className="relative mt-2 flex flex-shrink flex-grow flex-col px-2" position="bottom">
            <ChatList />
          </ScrollArea>
          <ChatInput />
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

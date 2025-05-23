'use client';

import { useQueryClient } from '@tanstack/react-query';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { ChevronLeft, Menu, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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
import { UserDataResponse } from '@/types/auth';
import { DetailGatheringType } from '@/types/gathering';
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
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<DetailGatheringType>(['appointment', id]);
  console.log(data);
  const participantList: UserDataResponse[] = /* data?.gatheringUsers ?? []; */ [
    {
      userId: 1,
      userCode: 'test1',
      userName: 'test1',
      profileImage: null,
    },
    {
      userId: 2,
      userCode: 'test2',
      userName: 'test2',
      profileImage: null,
    },
    {
      userId: 3,
      userCode: 'test3',
      userName: 'test3',
      profileImage: null,
    },
    {
      userId: 4,
      userCode: 'test4',
      userName: 'test4',
      profileImage: null,
    },
    {
      userId: 5,
      userCode: 'test5',
      userName: 'test5',
      profileImage: null,
    },
  ];

  const userMap = Object.fromEntries(participantList.map(user => [user.userId, user]));

  const participant = {
    online: [1, 4],
    offline: [2, 3, 5],
  };

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
          style={{ padding: '0px', height: '100vh', overflow: 'hidden', width: '100vw' }}
        >
          <div className="flex flex-1 items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-600">
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
              <SheetContent style={{ width: '60%' }}>
                <SheetTitle>참여자</SheetTitle>
                <ScrollArea>
                  <div className="mt-6 flex flex-col gap-8">
                    <div>
                      <h2 className="font-semibold">{`온라인 - ${participant.online.length}명`}</h2>
                      <div className="ml-2 mt-3 flex flex-col gap-4">
                        {participant.online.map(id => (
                          <div key={id} className="flex cursor-default items-center gap-4">
                            <Image
                              alt="profile"
                              src={userMap[id].profileImage ?? '/sample.jpg'}
                              width={36}
                              height={36}
                              className="flex-shrink-0 rounded-full"
                            />
                            <div className="flex-1 flex-shrink truncate text-lg">{userMap[id].userName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="font-semibold">{`오프라인 - ${participant.offline.length}명`}</h2>
                      <div className="ml-2 mt-3 flex flex-col gap-4">
                        {participant.offline.map(id => (
                          <div key={id} className="flex cursor-default items-center gap-4">
                            <Image
                              alt="profile"
                              src={userMap[id].profileImage ?? '/sample.jpg'}
                              width={36}
                              height={36}
                              className="flex-shrink-0 rounded-full"
                            />
                            <div className="flex-1 flex-shrink truncate text-lg">{userMap[id].userName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <ChatList />

          <ChatInput />
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

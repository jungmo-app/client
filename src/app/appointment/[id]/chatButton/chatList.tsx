import { ChatType, GroupChatType } from '@/types/chat';
import { formattedDateKr, isSameDateHourMinute, isSameDay } from '@/utils/date';
import ChatBubble from './chatBubble';

export default function ChatList() {
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
      text: `test1test1test1test1/ntest1test1`,
      date: 'Fri May 02 2025 18:52:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 5,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sat May 03 2025 18:52:11 GMT+0900 (한국 표준시)',
    },
    {
      id: 6,
      userId: 3,
      profileImage: null,
      userName: 'test3',
      text: `test1test1`,
      date: 'Sat May 03 2025 18:53:11 GMT+0900 (한국 표준시)',
    },
  ];

  const groupChat = chat.reduce<GroupChatType[]>((acc, item) => {
    if (acc.length === 0) {
      const accItem: GroupChatType[] = [{ ...item, text: [item.text] }];
      return accItem;
    }
    const lastItem = acc[acc.length - 1];
    if (isSameDateHourMinute(new Date(lastItem.date), new Date(item.date)) && lastItem.userId === item.userId) {
      return [...acc, { ...lastItem, text: [...lastItem.text, item.text] }];
    }

    return [...acc, { ...item, text: [item.text] }];
  }, []);

  console.log(groupChat);
  return (
    <div className="flex flex-col gap-2 px-2 pb-2">
      {groupChat.map((item, i) => {
        return (
          <div key={i}>
            {(i === 0 || (i !== 0 && isSameDay(new Date(item.date), new Date(groupChat[i - 1].date)))) && (
              <div className="flex w-full justify-center">
                <div className="dark:bg- my-4 rounded-3xl bg-shadow-15 px-4 py-2 text-[10px] text-background dark:bg-white-shadow-15 dark:text-foreground">
                  {formattedDateKr(new Date(item.date))}
                </div>
              </div>
            )}
            <ChatBubble isMe={item.userId === 2} message={item.text} />
          </div>
        );
      })}
    </div>
  );
}

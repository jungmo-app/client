import Image from 'next/image';

interface ChatBubbleProps {
  isMe: boolean;
  message: string[];
}

export default function ChatBubble({ isMe, message }: ChatBubbleProps) {
  return (
    <div className={`flex gap-1 ${isMe && 'flex-row-reverse'}`}>
      {!isMe && (
        <div className="size-8">
          <Image src="/sample.jpg" alt="profile" width="32" height="32" className="rounded-full" />
        </div>
      )}

      <div className={`flex w-80 flex-col gap-1 ${isMe && 'items-end'}`}>
        {!isMe && <div className={`w-20 truncate text-xs ${isMe && 'text-right'}`}>이름</div>}
        {message.map((item, i) => (
          <div key={i} className={`flex items-end ${isMe && 'flex-row-reverse'} gap-[6px]`}>
            <div
              className={`relative w-fit max-w-72 ${isMe ? `bg-blue-500 text-white` : `bg-gray-100 text-gray-900`} whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm leading-relaxed`}
            >
              {item}
            </div>
            {i === message.length - 1 && <p className="text-[9px] text-gray-500">오후 1:20</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

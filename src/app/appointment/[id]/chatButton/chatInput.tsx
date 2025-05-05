'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui';

const MAX_LINE = 4;

export default function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>('');

  const resizeTextArea = () => {
    const el = inputRef.current;
    if (!el) {
      return;
    }
    const maxHeight = MAX_LINE * 24 + 4;
    el.style.height = 'auto';
    el.style.overflow = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextArea();
  };

  useEffect(() => {
    resizeTextArea();
  }, []);
  return (
    <form className="mb-2 flex w-full max-w-mobile items-end gap-2 rounded-md p-2">
      <textarea
        ref={inputRef}
        value={value}
        rows={1}
        className="flex w-full resize-none items-center overflow-hidden rounded-md border border-gray-400 px-2 py-[9px] text-sm outline-none"
        placeholder="메세지를 입력해주세요"
        onChange={handleChange}
      />
      <Button variant="secondary" size="icon" style={{ borderRadius: '9999px' }}>
        <SendHorizonal />
      </Button>
    </form>
  );
}

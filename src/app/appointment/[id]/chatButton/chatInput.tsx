'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ImagePlusIcon, SendHorizonal } from 'lucide-react';
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

  const handleSubmit = () => {
    if (!value.trim()) {
      return;
    }
    /* API */
    console.log(value);
    setValue('');
    requestAnimationFrame(resizeTextArea);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    resizeTextArea();
  }, []);

  return (
    <form
      className="border-gray-200p-2 mb-2 flex w-full max-w-mobile items-end gap-2 rounded-md border-t px-2 py-2"
      onSubmit={handleFormSubmit}
    >
      <Button
        variant="secondary"
        size="icon"
        className="[&_svg]:size-5"
        style={{ width: '40px', borderRadius: '9999px' }}
      >
        <ImagePlusIcon />
      </Button>
      <textarea
        ref={inputRef}
        value={value}
        rows={1}
        className="m-1 flex w-full resize-none items-center overflow-hidden rounded-md border border-gray-400 px-2 py-[9px] text-sm outline-none"
        placeholder="메세지를 입력해주세요"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <Button variant="secondary" size="icon" style={{ borderRadius: '9999px' }}>
        <SendHorizonal />
      </Button>
    </form>
  );
}

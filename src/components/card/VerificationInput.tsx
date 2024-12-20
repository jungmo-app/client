'use client';

import { useRef } from 'react';

type VerificationInputProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export default function VerificationInput({ value, onChange, maxLength = 6 }: VerificationInputProps) {
  const inputRefs = Array.from({ length: maxLength }, () => useRef<HTMLInputElement>(null));

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newValue = value.split('');
    newValue[index] = inputValue;
    const combinedValue = newValue.join('');
    onChange(combinedValue);

    // 입력 후 다음 input으로 포커스 이동
    if (inputValue && index < maxLength - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // 현재 input이 비어있고 Backspace를 누르면 이전 input으로 이동
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, maxLength);
    if (!/^\d*$/.test(pastedData)) return;
    onChange(pastedData.padEnd(maxLength, ''));
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: maxLength }).map((_, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg focus:border-blue-500 focus:outline-none"
          value={value[index] || ''}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

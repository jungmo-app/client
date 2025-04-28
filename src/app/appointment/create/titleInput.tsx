'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { LucideFileTerminal } from 'lucide-react';
import { Card, Input, Label } from '@/components/ui';

export default function TitleInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LucideFileTerminal className="h-4 w-4" />
          <Label>제목</Label>
        </div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input placeholder="일정 제목을 입력해주세요" className="bg-background" {...field} />}
        />
        {errors.title && <span className="text-red-500">제목을 입력해주세요</span>}
      </div>
    </Card>
  );
}

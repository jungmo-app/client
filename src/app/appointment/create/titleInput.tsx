'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Card, Input, Label } from '@/components/ui';

export default function TitleInput() {
  const { control } = useFormContext();
  return (
    <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <Label>제목</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input placeholder="일정 제목을 입력해주세요" className="bg-white" {...field} />}
        />
      </div>
    </Card>
  );
}

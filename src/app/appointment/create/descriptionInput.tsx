'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Card, Label, Textarea } from '@/components/ui';

export default function DescriptionInput() {
  const { control } = useFormContext();
  return (
    <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <Label>설명</Label>
        <Controller
          name="memo"
          control={control}
          render={({ field }) => (
            <Textarea placeholder="일정에 대한 설명을 입력해주세요" className="bg-white" {...field} />
          )}
        />
      </div>
    </Card>
  );
}

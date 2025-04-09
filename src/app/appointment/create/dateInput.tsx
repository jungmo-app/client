'use client';

import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { DatePickerSheet, TimePickerSheet } from '@/components';
import { Card, Label } from '@/components/ui';
import { formattedDate } from '@/utils/date';

export default function DateInput() {
  const { getValues, setValue } = useFormContext();
  return (
    <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Label>날짜 및 시간</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DatePickerSheet
            value={new Date(getValues('startDate'))}
            onSelect={date => setValue('startDate', formattedDate(date))}
          />
          <TimePickerSheet
            value={getValues('startTime')}
            onSelect={time =>
              setValue(
                'startTime',
                `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`
              )
            }
          />
        </div>
      </div>
    </Card>
  );
}

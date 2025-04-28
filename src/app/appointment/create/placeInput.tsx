'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { LocaitionInput } from '@/components';
import { Card, Label } from '@/components/ui';

export default function PlaceInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <Label>장소</Label>
        </div>
        <Controller
          name="meetingLocation"
          control={control}
          render={({ field }) => (
            <LocaitionInput
              value={field.value.address}
              onChange={location => field.onChange({ id: location.id, address: location.address, name: location.name })}
            />
          )}
        />
        {errors.meetingLocation && <span className="text-red-500">올바른 장소를 입력해주세요</span>}
      </div>
    </Card>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui';

interface TimePickerContentProps {
  selectedHour: number;
  selectedMinute: number;
  onSelectHour: (hours: number) => void;
  onSelectMinute: (minute: number) => void;
}

export default function TimePickerContent({
  selectedHour,
  selectedMinute,
  onSelectHour,
  onSelectMinute,
}: TimePickerContentProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const hoursRef = useRef<(HTMLButtonElement | null)[]>(Array.from({ length: 24 }, () => null));
  const minuteRef = useRef<(HTMLButtonElement | null)[]>(Array.from({ length: 60 }, () => null));

  const handleClickHourButton = (hours: number) => {
    onSelectHour(hours);
  };

  const handleClickMinuteButton = (minute: number) => {
    onSelectMinute(minute);
  };

  useEffect(() => {
    hoursRef.current[selectedHour]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    minuteRef.current[selectedMinute]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selectedHour, selectedMinute]);
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <div className="scrollbar-hide h-[200px] w-[80px] snap-y snap-mandatory overflow-auto">
        {hours.map(hour => (
          <Button
            key={hour}
            variant="ghost"
            size="lg"
            className={`flex h-[40px] snap-center items-center justify-center ${selectedHour === hour ? 'text-lg font-bold text-blue-500' : 'text-gray-600'}`}
            ref={el => {
              hoursRef.current[hour] = el;
            }}
            onClick={() => handleClickHourButton(hour)}
          >
            {hour.toString().padStart(2, '0')}
          </Button>
        ))}
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="scrollbar-hide h-[200px] w-[80px] snap-y snap-mandatory overflow-auto">
        {minutes.map(minute => (
          <Button
            key={minute}
            variant="ghost"
            size="lg"
            className={`flex h-[40px] snap-center items-center justify-center ${selectedMinute === minute ? 'text-lg font-bold text-blue-500' : 'text-gray-600'}`}
            ref={el => {
              minuteRef.current[minute] = el;
            }}
            onClick={() => handleClickMinuteButton(minute)}
          >
            {minute.toString().padStart(2, '0')}
          </Button>
        ))}
      </div>
    </div>
  );
}

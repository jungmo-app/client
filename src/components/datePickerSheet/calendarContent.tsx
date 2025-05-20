import { memo } from 'react';
import Calendar from '@/components/calendar';

interface CalenderContentProps {
  date: Date;
  currentDate: Date;
  onSelect: (date: Date) => void;
}

const CalendarContent = memo(({ date, currentDate, onSelect }: CalenderContentProps) => {
  return (
    <div className="flex flex-col gap-5 text-lg font-semibold">
      <p className="ml-4 text-xl">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</p>
      <div className="h-80">
        <Calendar showAdjacentDays date={date} selectedDate={currentDate} onSelect={onSelect} />
      </div>
    </div>
  );
});

CalendarContent.displayName = 'CalenderContent';

export default CalendarContent;

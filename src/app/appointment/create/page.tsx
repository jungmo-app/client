'use client';

import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import AttendeeInput from '@/components/AttendeeInput';
import { DatePickerSheet } from '@/components/date-picker-sheet';
import { TimePickerSheet } from '@/components/time-picker-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PARTICIPANTS } from '@/mocks/appointment';

type AppointmentFormData = {
  title: string;
  datetime: string;
  description: string;
  location: {
    name: string;
    address: string;
  };
};

export default function CreateAppointment() {
  const [attendees, setAttendees] = useState<typeof PARTICIPANTS>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    datetime: '',
    description: '',
    location: {
      name: '',
      address: '',
    },
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-14 items-center justify-between bg-white px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              ✕
            </Button>
          </Link>
          <h1 className="text-lg font-medium">일정 추가</h1>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <Label>제목</Label>
            <Input
              placeholder="일정 제목을 입력해주세요"
              className="bg-white"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </Card>

        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label>날짜 및 시간</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DatePickerSheet onSelect={date => console.log(date)} />
              <TimePickerSheet onSelect={time => console.log(time)} />
            </div>
          </div>
        </Card>
        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Label>장소</Label>
            </div>
            <Input
              placeholder="장소를 검색해주세요"
              className="bg-white"
              value={formData.location.name}
              onChange={e =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, name: e.target.value },
                })
              }
            />
          </div>
        </Card>

        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <Label>설명</Label>
            <Textarea
              placeholder="일정에 대한 설명을 입력해주세요"
              className="bg-white"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </Card>
        <AttendeeInput selectedAttendees={attendees} onAttendeesChange={setAttendees} />

        <div className="z-10 border-t bg-white fixed-mobile-bottom">
          <div className="p-4">
            <Button className="w-full rounded-xl" size="lg" onClick={handleSubmit}>
              일정 추가
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

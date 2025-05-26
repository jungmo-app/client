'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Card, Input, Label } from '@/components/ui';
import { UserDataResponse } from '@/types/auth';
import AttendeeSelectModal from './modals/attendeeSelectModal';

type AttendeeInputProps = {
  selectedAttendees: UserDataResponse[];
  onAttendeesChange: (attendees: UserDataResponse[]) => void;
};

export default function AttendeeInput({ selectedAttendees, onAttendeesChange }: AttendeeInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="relative space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="size-4" />
          <Label>참가자</Label>
        </div>
        <Input
          readOnly
          placeholder="참석자를 선택해주세요"
          value={selectedAttendees.map(user => user.userName).join(', ')}
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <AttendeeSelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={onAttendeesChange} />
    </Card>
  );
}

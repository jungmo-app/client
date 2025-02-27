'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import AttendeeSelectModal from '@/components/modals/attendeeSelectModal';
import { Button, Input } from '@/components/ui';
import { UserDataResponse } from '@/types/user';

type AttendeeInputProps = {
  selectedAttendees: UserDataResponse[];
  onAttendeesChange: (attendees: UserDataResponse[]) => void;
};

export default function AttendeeInput({ selectedAttendees, onAttendeesChange }: AttendeeInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <Input
        readOnly
        placeholder="참석자를 선택해주세요"
        value={selectedAttendees.map(user => user.userName).join(', ')}
        className="cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setIsModalOpen(true)}
      >
        <Users className="h-4 w-4" />
      </Button>

      <AttendeeSelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={onAttendeesChange} />
    </div>
  );
}

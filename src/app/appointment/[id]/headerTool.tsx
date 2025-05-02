'use client';

import { useState } from 'react';
import { MoreVertical, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useDeleteAppointment } from '@/hooks/useMutate/useDeleteAppointment';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import ChatButton from './chatButton';

export default function HeaderTool() {
  const params = useParams();
  const id = Number(params.id);

  const { data: appointment } = useAppointment(id);
  const [isOpenPopOver, setIsOpenPopover] = useState(false);

  const { mutate: deleteAppointment, isPending } = useDeleteAppointment(
    id,
    new Date(appointment?.startDate ?? ''),
    () => {},
    () => {
      setIsOpenPopover(false);
    }
  );

  const handleOpenPopover = (value: boolean) => {
    setIsOpenPopover(value);
  };

  const handleDeleteAppointment = async () => {
    deleteAppointment();
  };

  const isEditable = appointment?.authority === 'WRITE';
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="공유 버튼">
        <Share2 className="h-5 w-5" />
      </Button>
      <ChatButton />
      {isEditable && (
        <Popover open={isOpenPopOver} onOpenChange={handleOpenPopover}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 self-start" aria-label="더보기">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="flex -translate-x-8 items-center justify-center p-0 text-sm"
            style={{ width: '88px', height: '48px' }}
          >
            <Button variant="ghost" aria-label="삭제" disabled={isPending} onClick={handleDeleteAppointment}>
              삭제하기
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

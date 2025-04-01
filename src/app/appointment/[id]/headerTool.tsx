'use client';

import { useState } from 'react';
import { MoreVertical, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Button } from '@/components/ui/button';

interface HeaderToolProps {
  id: number;
}

export default function HeaderTool({ id }: HeaderToolProps) {
  const router = useRouter();
  const [isOpenPopOver, setIsOpenPopover] = useState(false);

  const handleOpenPopover = (value: boolean) => {
    setIsOpenPopover(value);
  };

  const handleDeleteAppointment = async () => {
    const result = await apis.gathering.delete(id);
    if (!result) {
      setIsOpenPopover(false);
      alert('삭제에 실패하였습니다');
      return;
    }
    router.push('/');
  };
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="공유 버튼">
        <Share2 className="h-5 w-5" />
      </Button>
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
          <Button variant="ghost" aria-label="삭제" onClick={handleDeleteAppointment}>
            삭제하기
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

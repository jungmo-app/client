import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
} from '@/components/ui';

type MemoSheetProps = {
  initialMemo: string;
  onSave: (memo: string) => void;
};

export default function MemoSheet({ initialMemo, onSave }: MemoSheetProps) {
  const [memo, setMemo] = useState(initialMemo);
  const [tempMemo, setTempMemo] = useState(initialMemo);
  const MAX_LENGTH = 60;

  const handleSave = () => {
    setMemo(tempMemo);
    onSave(tempMemo);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full text-left">
        <>
          <span className="mb-4 block text-gray-600">메모</span>
          <div className="w-full">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 py-6">
              <span className="text-gray-400">{memo || '메모를 입력해주세요'}</span>
              <ChevronRight className="ml-2 h-5 w-5 flex-shrink-0 text-gray-400" />
            </div>
          </div>
        </>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>메모 입력</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Textarea
              value={tempMemo}
              placeholder="메모를 입력해주세요"
              className="min-h-[120px]"
              maxLength={MAX_LENGTH}
              onChange={e => {
                const input = e.target.value;
                if (input.length <= MAX_LENGTH) {
                  setTempMemo(input);
                }
              }}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-400">
              {tempMemo.length} / {MAX_LENGTH}
            </div>
          </div>
          <SheetClose asChild>
            <Button className="w-full" aria-label="확인" onClick={handleSave}>
              확인
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

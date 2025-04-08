'use client';

import { useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { ButtonContext } from '@/contexts/ButtonClickProvider';
import { useDeleteAccount } from '@/hooks/useMutate/useDeleteAccount';

export default function DeleteAccountSheet() {
  const { isClicked, changeClick } = useContext(ButtonContext);
  const handleSuccess = () => {
    changeClick(false);
  };

  const handleError = () => {
    changeClick(false);
  };

  const { mutate: deleteAccount } = useDeleteAccount(handleSuccess, handleError);
  const handleDeleteAccount = async () => {
    changeClick(true);
    deleteAccount();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between px-0 text-gray-500 hover:bg-transparent"
          aria-label="계정 삭제"
          disabled={isClicked}
        >
          <span>계정 삭제</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader className="mb-4">
          <SheetTitle>정말 탈퇴하시겠어요?</SheetTitle>
          <SheetDescription className="text-base text-gray-600">
            탈퇴 시 모든 데이터는 즉시 삭제되며, 이 작업은 되돌릴 수 없어요.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex-col gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full" aria-label="취소" disabled={isClicked}>
              취소
            </Button>
          </SheetClose>
          <Button
            variant="destructive"
            className="w-full"
            disabled={isClicked}
            aria-label="탈퇴"
            onClick={handleDeleteAccount}
          >
            탈퇴하기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

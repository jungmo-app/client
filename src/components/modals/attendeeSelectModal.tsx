'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Search, X } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { useSearchUserKeyword } from '@/hooks/useQuery/useSearchUserKeyword';
import { UserDataResponse } from '@/types/user';

type AttendeeSelectModalProps = {
  isOpen: boolean;
  value?: UserDataResponse[];
  onClose: () => void;
  onSelect: (selectedUsers: UserDataResponse[]) => void;
};

export default function AttendeeSelectModal({ isOpen, value, onClose, onSelect }: AttendeeSelectModalProps) {
  const { register, getValues } = useForm();

  const [debouncedKeyword, setDeboundedKeyword] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<UserDataResponse[]>(value ?? []);

  const { data: searchList = [], isError } = useSearchUserKeyword(debouncedKeyword);

  const handleSearchUser = useCallback((value: string) => {
    const debouncedFetchData = debounce(async (value: string) => {
      setDeboundedKeyword(value);
    });
    debouncedFetchData(value);
  }, []);

  const handleUserSelect = (newUser: UserDataResponse) => {
    setSelectedUsers(prev => [...prev.filter(user => user.userId !== newUser.userId), newUser]);
  };

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.userId !== userId));
  };

  const handleConfirm = () => {
    onSelect(selectedUsers);
    onClose();
  };

  const handleClose = () => {
    setSelectedUsers(value ?? []);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="flex w-full flex-col">
        <SheetHeader>
          <SheetTitle>참석자 추가</SheetTitle>
          <SheetDescription>참석자 추가 시트</SheetDescription>
        </SheetHeader>

        <div className="mt-2 flex h-[60vh] flex-col gap-4">
          {/* 선택된 참석자 목록 */}
          {selectedUsers.length > 0 && (
            <ScrollArea className="max-h-20">
              <div className="flex flex-wrap gap-2 p-2">
                {selectedUsers.map(user => (
                  <div key={user.userId} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>{user.userName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.userName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      aria-label="닫기"
                      onClick={() => handleUserRemove(user.userId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* 검색 입력창 */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoComplete="on"
              {...register('searchValue', { onChange: e => handleSearchUser(e.target.value) })}
              placeholder="사용자 코드로 검색"
              className="pl-8"
            />
          </div>

          {/* 검색 결과 목록 */}
          {isError ? (
            <div className="flex size-full items-center justify-center text-red-600">
              검색 결과를 불러올 수 없습니다
            </div>
          ) : searchList.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 space-y-2">
                {searchList.map(user => (
                  <Button
                    key={user.userId}
                    variant="ghost"
                    className="w-full gap-2"
                    style={{ justifyContent: 'flex-start' }}
                    aria-label="사용자 선택"
                    onClick={() => handleUserSelect(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>{user.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium">{user.userName}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="mt-4 flex w-full flex-1 items-center justify-center">
              {getValues('searchValue') ? '검색 결과 없습니다.' : '검색어를 입력해주세요'}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" aria-label="취소" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleConfirm}>확인</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Search, X } from 'lucide-react';
import { apis } from '@/apis';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { UserDataResponse } from '@/types/user';

type AttendeeSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUsers: UserDataResponse[]) => void;
};

export default function AttendeeSelectModal({ isOpen, onClose, onSelect }: AttendeeSelectModalProps) {
  const { register } = useForm();
  const [isError, setIsError] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<UserDataResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserDataResponse[]>([]);

  const handleSearchUser = useCallback((value: string) => {
    const debouncedFetchData = debounce(async (value: string) => {
      const response = await apis.user.search(value);
      if (!response) {
        setIsError(true);
        return;
      }
      setSearchResult(response);
    }, 500);
    setIsError(false);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="w-full">
        <SheetHeader>
          <SheetTitle>참석자 추가</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex h-[calc(100vh-8rem)] flex-col gap-4">
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
              {...register}
              placeholder="이름으로 검색"
              className="pl-8"
              onChange={e => handleSearchUser(e.target.value)}
            />
          </div>

          {/* 검색 결과 목록 */}
          {isError ? (
            <div className="flex size-full items-center justify-center text-red-600">
              검색 결과를 불러올 수 없습니다
            </div>
          ) : (
            <ScrollArea className="flex-1">
              {searchResult.length > 0 ? (
                <div className="flex flex-col gap-1 space-y-2">
                  {searchResult.map(user => (
                    <Button
                      key={user.userId}
                      variant="ghost"
                      className="w-full gap-2"
                      style={{ justifyContent: 'flex-start' }}
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
              ) : (
                <div className="mt-4 flex w-full items-center justify-center">검색 결과 없습니다.</div>
              )}
            </ScrollArea>
          )}

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleConfirm}>확인</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

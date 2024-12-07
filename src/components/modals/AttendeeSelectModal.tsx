import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PARTICIPANTS } from '@/mocks/appointment';

type AttendeeSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUsers: typeof PARTICIPANTS) => void;
};

export default function AttendeeSelectModal({ isOpen, onClose, onSelect }: AttendeeSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<typeof PARTICIPANTS>([]);

  const filteredUsers = PARTICIPANTS.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.some(selected => selected.id === user.id)
  );

  const handleUserSelect = (user: (typeof PARTICIPANTS)[0]) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleConfirm = () => {
    onSelect(selectedUsers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>참석자 추가</DialogTitle>
        </DialogHeader>

        {/* 선택된 참석자 목록 */}
        {selectedUsers.length > 0 && (
          <ScrollArea className="max-h-20">
            <div className="flex flex-wrap gap-2 p-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleUserRemove(user.id)}>
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
            placeholder="이름으로 검색"
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 검색 결과 목록 */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {filteredUsers.map(user => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{user.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

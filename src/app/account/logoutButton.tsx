'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button } from '@/components/ui';

export default function LogoutButton() {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClickButton = async () => {
    if (isClicked) {
      return;
    }
    setIsClicked(true);
    const logout = await apis.auth.logout();
    if (logout) {
      alert('로그아웃 되었습니다');
      setIsClicked(false);
      router.push('/login');
      return;
    }
    setIsClicked(false);
    alert('로그아웃에 실패하였습니다');
  };
  return (
    <Button
      variant="ghost"
      disabled={isClicked}
      className="flex w-full justify-between px-0 text-red-500 hover:bg-transparent hover:text-red-400"
      onClick={handleClickButton}
    >
      <span>로그아웃</span>
      <ChevronRight className="h-5 w-5" />
    </Button>
  );
}

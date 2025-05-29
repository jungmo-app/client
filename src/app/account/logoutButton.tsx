'use client';

import React, { useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ButtonContext } from '@/contexts/ButtonClickProvider';
import { useLogout } from '@/hooks/useMutate/useLogout';

export default function LogoutButton() {
  const { isClicked, changeClick } = useContext(ButtonContext);

  const handleSuccess = () => {
    changeClick(false);
  };

  const handleError = () => {
    changeClick(false);
  };

  const { mutate: logout } = useLogout(handleSuccess, handleError);

  const handleClickButton = () => {
    changeClick(true);
    logout();
  };

  return (
    <Button
      variant="ghost"
      disabled={isClicked}
      className="flex w-full justify-between px-0 text-red-500 hover:bg-transparent hover:text-red-400"
      aria-label="로그아웃"
      onClick={handleClickButton}
    >
      <span>로그아웃</span>
      <ChevronRight className="h-5 w-5" />
    </Button>
  );
}

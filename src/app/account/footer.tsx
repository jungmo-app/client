'use client';

import { useUserData } from '@/hooks/useQuery/useUserData';
import ChangePasswordSheet from './changePasswordSheet';
import DeleteAccountSheet from './deleteAccountSheet';
import LogoutButton from './logoutButton';

export default function Footer() {
  const { data: userData } = useUserData();
  if (!userData) {
    return <div />;
  }

  return (
    <footer className="my-8 flex flex-col items-center gap-2">
      {userData.provider === 'email' && <ChangePasswordSheet />}
      <DeleteAccountSheet />
      <LogoutButton />
    </footer>
  );
}

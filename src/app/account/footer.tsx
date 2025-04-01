'use client';

import { useContext } from 'react';
import { SessionContext } from '@/contexts/SessionProvider';
import ChangePasswordSheet from './changePasswordSheet';
import DeleteAccountSheet from './deleteAccountSheet';
import LogoutButton from './logoutButton';

export default function Footer() {
  const { userData } = useContext(SessionContext);

  return (
    <footer className="my-8 flex flex-col items-center gap-2">
      {userData?.provider === 'email' && <ChangePasswordSheet />}
      <DeleteAccountSheet />
      <LogoutButton />
    </footer>
  );
}

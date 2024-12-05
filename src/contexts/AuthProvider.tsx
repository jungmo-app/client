'use server';

import { verifySession } from '@/libs/auth/session';
import { StrictPropsWithChildren } from '@/types/common';
import UserProvider from './UserProvider';

const AuthProvider = async ({ children }: StrictPropsWithChildren) => {
  const session = await verifySession();

  return <UserProvider session={session}>{children}</UserProvider>;
};

export { AuthProvider };

'use client';

import { useHydrateAtoms } from 'jotai/utils';
import { isLoggedInAtom } from '@/stores/auth';
import { SessionType, userAtom } from '@/stores/user';
import { StrictPropsWithChildren } from '@/types/common';

const UserProvider = ({ children, session }: StrictPropsWithChildren<{ session: SessionType | undefined }>) => {
  useHydrateAtoms([[isLoggedInAtom, session ? true : false]]);
  useHydrateAtoms([[userAtom, session]]);

  return <>{children}</>;
};

export default UserProvider;

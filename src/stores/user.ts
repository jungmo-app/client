import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export type SessionType = {
  memberId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export const userAtom = atomWithReset<SessionType | undefined>(undefined);

export const useUserAtomValue = () => useAtomValue(userAtom);

export const useSetUserAtom = () => useSetAtom(userAtom);

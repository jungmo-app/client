import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const isLoggedInAtom = atomWithReset<boolean>(false);

export const useIsLoggedInAtom = () => useAtom(isLoggedInAtom);

export const useIsLoggedInAtomValue = () => useAtomValue(isLoggedInAtom);

export const useSetIsLoggedInAtom = () => useSetAtom(isLoggedInAtom);

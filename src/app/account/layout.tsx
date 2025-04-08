import { PropsWithChildren } from 'react';
import { ButtonContextProvider } from '@/contexts/ButtonClickProvider';

export default function Layout({ children }: PropsWithChildren) {
  return <ButtonContextProvider>{children}</ButtonContextProvider>;
}

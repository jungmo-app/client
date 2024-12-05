'use client';

import { ThemeProvider as BaseThemeProvider } from 'next-themes';
import { settings } from '@/config/settings';
import { StrictPropsWithChildren } from '@/types/common';

const ThemeProvider = ({ children }: StrictPropsWithChildren) => {
  const defaultTheme = settings.themeToggleEnabled ? 'system' : 'light';

  return (
    <BaseThemeProvider enableSystem attribute="class" defaultTheme={defaultTheme}>
      {children}
    </BaseThemeProvider>
  );
};

export { ThemeProvider };

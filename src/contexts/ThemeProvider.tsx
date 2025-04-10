'use client';

import { Theme } from '@radix-ui/themes';
import { ThemeProvider as BaseThemeProvider } from 'next-themes';
import { settings } from '@/config/settings';
import { StrictPropsWithChildren } from '@/types/common';
import '@radix-ui/themes/styles.css';

const ThemeProvider = ({ children }: StrictPropsWithChildren) => {
  const defaultTheme = settings.themeToggleEnabled ? 'system' : 'light';

  return (
    <BaseThemeProvider enableSystem attribute="class" defaultTheme={defaultTheme}>
      <Theme>{children}</Theme>
    </BaseThemeProvider>
  );
};

export { ThemeProvider };
